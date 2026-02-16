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
  @property chipSize: number = 200;
  @property gap: number = 0;

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
      chip.node.setPosition(this.gridToWorld(chip.row, chip.col));
      this.chipContainer.addChild(chip.node);
      this.chipNodeMap.set(chip.chipId, chip.node);
    });

    console.log('First chip pos:', chips[0]?.node.position);
    console.log('Last chip pos:', chips[chips.length - 1]?.node.position);
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
    const step = this.chipSize + this.gap;
    const uiTransform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);

    uiTransform.setContentSize(new Size(cols * step, rows * step));
  }

  gridToWorld(row: number, col: number): Vec3 {
    const step = this.chipSize + this.gap;
    const offsetX = (-(this.model.cols - 1) * step) / 2;
    const offsetY = ((this.model.rows - 1) * step) / 2;

    return v3(offsetX + col * step, offsetY - row * step, 0);
  }

  updateChipPosition(chip: Chip) {
    const node = this.chipNodeMap.get(chip.chipId);
    if (node) {
      node.setPosition(this.gridToWorld(chip.row, chip.col));
    }
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
