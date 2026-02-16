import { Prefab } from 'cc';
import { Grid } from './types.ts';
import { Chip } from '../chip/Chip.ts';
import { ChipData, ChipKind } from '../chip/types.ts';
import { uid } from '../../shared/utils/uid.ts';
import { createChip } from '../../shared/utils/index.ts';
import { getColorByIndex, getRandomBlockColor } from '../chip/lib/index.ts';
import { shuffleArray } from '../../shared/utils/shuffle.ts';

export class GameField {
  private chipPrefab: Prefab = null;

  private grid: Grid = [];

  rows: number = 0;

  cols: number = 0;

  private uniqueChipsCount: number = 0;

  private chipMap: Map<string, Chip> = new Map();

  init(prefab: Prefab, rows: number, cols: number, uniqueChipsCount: number) {
    this.chipPrefab = prefab;
    this.rows = rows;
    this.cols = cols;
    this.uniqueChipsCount = uniqueChipsCount;

    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  getChipById(id: string): Chip | undefined {
    return this.chipMap.get(id);
  }

  getByCoords(row: number, col: number) {
    return this.grid[row][col];
  }

  add(chipData: ChipData, row: number, col: number) {
    if (this.getByCoords(row, col)) return;

    const chip = createChip(this.chipPrefab, uid(), chipData, row, col);
    this.chipMap.set(chip.chipId, chip);
    this.grid[row][col] = chip;

    return chip;
  }

  fill(preset?: number[][]): Chip[] {
    const { uniqueChipsCount } = this;
    const newChips: Chip[] = [];

    this.grid = this.grid.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (col === null) {
          const presetIndex = preset?.[rowIndex]?.[colIndex];
          const color =
            presetIndex !== undefined
              ? getColorByIndex(presetIndex)
              : getRandomBlockColor(uniqueChipsCount);
          const block = createChip(
            this.chipPrefab,
            uid().toString(),
            { kind: ChipKind.COLOR, color },
            rowIndex,
            colIndex,
          );
          newChips.push(block);
          this.chipMap.set(block.chipId, block);
          return block;
        }
        return col;
      });
    });

    return newChips;
  }

  getGrid() {
    return this.grid;
  }

  getGridSettings() {
    return {
      rows: this.rows,
      cols: this.cols,
      uniqueChipsCount: this.uniqueChipsCount,
    };
  }

  gravityColumn(col: number): (Chip | null)[] {
    const { grid } = this;
    const columnChips = grid.map((row) => row[col]);
    const filteredColumn = columnChips.filter((chip) => chip !== null);
    const result: (Chip | null)[] = Array(columnChips.length - filteredColumn.length)
      .fill(null)
      .concat(...filteredColumn);

    result.forEach((chip, index) => {
      if (!chip) return;
      chip.row = index;
    });

    return result;
  }

  gravityGrid(): Chip[] {
    const cols = this.grid[0].length;

    for (let col = 0; col < cols; col++) {
      const chips = this.gravityColumn(col);

      chips.forEach((chip, row) => {
        this.grid[row][col] = chip;
      });
    }

    return this.grid.flat().filter((chip) => chip !== null && chip.row !== chip.prevRow) as Chip[];
  }

  shuffleGrid() {
    const chips = this.grid.flat().filter((chip): chip is Chip => chip !== null);
    const shuffled = shuffleArray(chips);

    shuffled.forEach((chip, index) => {
      chip.row = Math.floor(index / this.cols);
      chip.col = index % this.cols;
      this.grid[chip.row][chip.col] = chip;
    });

    return this.grid;
  }

  removeCluster(...chips: Chip[]) {
    chips.forEach(({ row, col, chipId }) => {
      this.chipMap.delete(chipId);
      this.grid[row][col] = null;
    });

    return chips;
  }
}
