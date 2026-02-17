import {
  _decorator,
  Component,
  Prefab,
  Node,
  v3,
  UITransform,
  EventTouch,
  Vec3,
  Size,
  v2,
  Vec2,
} from 'cc';
import { Chip } from '../chip/Chip.ts';
import { GameField } from './GameField.ts';

const { ccclass, property } = _decorator;

@ccclass('GameFieldView')
export class GameFieldView extends Component {
  @property(Prefab) chipPrefab: Prefab = null!;
  @property chipSize: number = 100;
  @property gap: Vec2 = v2(0, 0);

  private chipContainer: Node = null!;
  private chipNodeMap: Map<string, Node> = new Map();
  private model: GameField = null!;
  private inputEnabled: boolean = false;

  init(model: GameField) {
    this.model = model;
    this.chipContainer = new Node('ChipContainer');
    this.node.addChild(this.chipContainer);
  }

  enable() {
    this.inputEnabled = true;
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
  }

  disable() {
    this.inputEnabled = false;
    this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
  }

  addChips(...chips: Chip[]) {
    chips.forEach((chip) => {
      this.updateChipPosition(chip, chip.row, chip.col);
      this.chipContainer.addChild(chip.node);
      this.chipNodeMap.set(chip.chipId, chip.node);
    });

    this.sortByRow();
  }

  private sortByRow() {
    const children = [...this.chipContainer.children];
    children
      .sort((a, b) => {
        const chipA = a.getComponent(Chip);
        const chipB = b.getComponent(Chip);
        if (!chipA || !chipB) return 0;
        return chipB.row - chipA.row;
      })
      .forEach((child, i) => child.setSiblingIndex(i));
  }

  removeChips(...ids: string[]) {
    ids.forEach((id) => {
      const node = this.chipNodeMap.get(id);
      if (node) {
        node.destroy();
        this.chipNodeMap.delete(id);
      }
    });
  }

  getChipNode(id: string): Node | null {
    return this.chipNodeMap.get(id) ?? null;
  }

  getChipByPosition(worldPos: Vec2): Chip | null {
    for (const child of this.chipContainer.children) {
      const uiTransform = child.getComponent(UITransform);
      if (uiTransform && uiTransform.getBoundingBoxToWorld().contains(worldPos)) {
        return child.getComponent(Chip);
      }
    }
    return null;
  }

  setup(rows: number, cols: number) {
    const stepX = this.chipSize + this.gap.x;
    const stepY = this.chipSize + this.gap.y;
    const uiTransform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);

    uiTransform.setContentSize(new Size(cols * stepX, rows * stepY));
  }

  gridToWorld(row: number, col: number): Vec3 {
    const stepX = this.chipSize + this.gap.x;
    const stepY = this.chipSize + this.gap.y;
    const offsetX = (-(this.model.cols - 1) * stepX) / 2;
    const offsetY = ((this.model.rows - 1) * stepY) / 2;

    const x = offsetX + col * stepX;
    const y = offsetY - row * stepY;

    return v3(x, y, 0);
  }

  updateChipPosition(chip: Chip, row: number, col: number) {
    chip.node.setPosition(this.gridToWorld(row, col));
  }

  private onTouchStart(event: EventTouch) {
    if (!this.inputEnabled) return;

    const worldPos = event.getUILocation();
    const chip = this.getChipByPosition(v2(worldPos.x, worldPos.y));

    if (chip) {
      this.node.emit('chip-click', chip);
    }
  }
}
