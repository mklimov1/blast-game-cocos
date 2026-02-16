import { _decorator, Component, Prefab, tween, v3 } from 'cc';
import { GameField } from './GameField.ts';
import { GameFieldView } from './GameFieldView.ts';
import { Chip } from '../chip/Chip.ts';
import { ChipKind, ChipPower } from '../chip/types.ts';
import { sortByDistance, findConnected, hasAvailableMoves } from './lib/index.ts';
import {
  MIN_ROWS,
  MAX_ROWS,
  MIN_COLS,
  MAX_COLS,
  MIN_UNIQUE_CHIPS,
  MAX_UNIQUE_CHIPS,
  POWER_CHIP_THRESHOLD,
} from '../../shared/constants.ts';

const { ccclass, property } = _decorator;

type FieldOptions = {
  rows: number;
  cols: number;
  uniqueChipsCount: number;
  grid?: number[][];
};

@ccclass('GameFieldController')
export class GameFieldController extends Component {
  @property(Prefab) chipPrefab: Prefab = null!;

  private view: GameFieldView = null!;
  private model: GameField = new GameField();
  private isInitialized: boolean = false;
  private isProcessing: boolean = false;

  async setup(options: FieldOptions) {
    this.view = this.getComponent(GameFieldView)!;

    if (!this.view) {
      console.error('GameFieldView not found on this node!');
      return;
    }

    this.validateFieldOptions(options);

    this.model.init(this.chipPrefab, options.rows, options.cols, options.uniqueChipsCount);
    this.view.init(this.model);
    this.view.setup(options.rows, options.cols);

    const chips = this.model.fill(options.grid);
    this.view.addChips(...chips);

    await this.checkAndShuffleIfNeeded();

    this.attachEvents();
    this.isInitialized = true;
  }

  private validateFieldOptions(options: FieldOptions): void {
    const { rows, cols, uniqueChipsCount } = options;

    if (rows < MIN_ROWS || rows > MAX_ROWS) {
      throw new Error(`Rows must be between ${MIN_ROWS} and ${MAX_ROWS}, got ${rows}`);
    }
    if (cols < MIN_COLS || cols > MAX_COLS) {
      throw new Error(`Cols must be between ${MIN_COLS} and ${MAX_COLS}, got ${cols}`);
    }
    if (uniqueChipsCount < MIN_UNIQUE_CHIPS || uniqueChipsCount > MAX_UNIQUE_CHIPS) {
      throw new Error(
        `Unique chips must be between ${MIN_UNIQUE_CHIPS} and ${MAX_UNIQUE_CHIPS}, got ${uniqueChipsCount}`,
      );
    }
  }

  enable() {
    this.view.enable();
  }

  disable() {
    this.view.disable();
  }

  // --- Анимации ---

  private async destroyChipsAnimation(chips: Chip[]): Promise<void> {
    const promises = chips.map((chip) => {
      return new Promise<void>((resolve) => {
        tween(chip.node)
          .to(0.2, { scale: v3(0, 0, 1) })
          .call(() => resolve())
          .start();
      });
    });

    await Promise.all(promises);
    this.view.removeChips(...chips.map((c) => c.chipId));
  }

  private async dropChipsAnimation(chips: Chip[]): Promise<void> {
    const promises = chips.map((chip) => {
      const targetPos = this.view.gridToWorld(chip.row, chip.col);
      return new Promise<void>((resolve) => {
        tween(chip.node)
          .to(0.3, { position: targetPos }, { easing: 'bounceOut' })
          .call(() => resolve())
          .start();
      });
    });

    await Promise.all(promises);
  }

  private async spawnChipsAnimation(
    chips: Chip[],
    animation: 'none' | 'fade' | 'drop' = 'none',
  ): Promise<void> {
    if (animation === 'none') return;

    if (animation === 'fade') {
      // TODO: UIOpacity анимация
      return;
    }

    if (animation === 'drop') {
      const promises = chips.map((chip) => {
        const targetPos = chip.node.position.clone();
        chip.node.setPosition(v3(targetPos.x, targetPos.y + 200, 0));
        return new Promise<void>((resolve) => {
          tween(chip.node)
            .to(0.4, { position: targetPos }, { easing: 'bounceOut' })
            .call(() => resolve())
            .start();
        });
      });
      await Promise.all(promises);
    }
  }

  private async shuffleAnimation(): Promise<void> {
    const grid = this.model.getGrid();
    const promises: Promise<void>[] = [];

    for (const row of grid) {
      for (const chip of row) {
        if (!chip) continue;
        const targetPos = this.view.gridToWorld(chip.row, chip.col);
        promises.push(
          new Promise<void>((resolve) => {
            tween(chip.node)
              .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
              .call(() => resolve())
              .start();
          }),
        );
      }
    }

    await Promise.all(promises);
  }

  // --- Логика ---

  private findConnectedChips(chip: Chip): Chip[] {
    return findConnected(this.model.getGrid(), chip.row, chip.col);
  }

  private async checkAndShuffleIfNeeded(): Promise<void> {
    if (hasAvailableMoves(this.model.getGrid())) return;

    this.model.shuffleGrid();
    await this.shuffleAnimation();
    await this.checkAndShuffleIfNeeded();
  }

  private async processChipDestruction(chip: Chip): Promise<Chip[]> {
    const connected = this.findConnectedChips(chip);
    if (!connected.length) return [];

    const sorted = sortByDistance(connected, chip);
    this.node.emit('chips-destroyed', sorted);

    // TODO: sound
    this.model.removeCluster(...sorted);
    await this.destroyChipsAnimation(sorted);

    return sorted;
  }

  private async handlePowerChipSpawn(targetChip: Chip, destroyed: Chip[]): Promise<void> {
    if (targetChip.data.kind !== ChipKind.COLOR) return;
    if (destroyed.length <= POWER_CHIP_THRESHOLD) return;

    const powerChip = this.model.add(
      { kind: ChipKind.POWER, power: ChipPower.BOMB },
      targetChip.row,
      targetChip.col,
    );

    if (powerChip) {
      this.view.addChips(powerChip);
      await this.spawnChipsAnimation([powerChip], 'fade');
    }
  }

  private async refillField(): Promise<Chip[]> {
    const movedChips = this.model.gravityGrid();
    await this.dropChipsAnimation(movedChips);

    const newChips = this.model.fill();
    this.view.addChips(...newChips);
    await this.spawnChipsAnimation(newChips, 'drop');

    return newChips;
  }

  private async handleChipClick(chip: Chip): Promise<void> {
    if (!this.isInitialized) return;
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;
      this.disable();

      const destroyed = await this.processChipDestruction(chip);
      if (!destroyed.length) return;

      await this.handlePowerChipSpawn(chip, destroyed);
      const added = await this.refillField();

      this.node.emit('update-field', { destroyed, added });
    } catch (error) {
      console.error('Error processing field click:', error);
    } finally {
      this.isProcessing = false;
      this.enable();
    }
  }

  // --- События ---

  private attachEvents() {
    this.view.node.on('chip-click', this.handleChipClick, this);
  }

  private detachEvents() {
    this.view.node.off('chip-click', this.handleChipClick, this);
  }

  onDestroy() {
    this.detachEvents();
    this.isInitialized = false;
    this.isProcessing = false;
  }
}
