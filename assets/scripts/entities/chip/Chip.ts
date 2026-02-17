import { _decorator, Component, Sprite, SpriteFrame, resources, UITransform } from 'cc';
import { ChipData, ChipKind, ChipColor } from './types.ts';
import { CHIP_SPRITE_PATHS } from './constants.ts';

const { ccclass } = _decorator;

@ccclass('Chip')
export class Chip extends Component {
  private _chipId: string = '';
  private _data: ChipData = { kind: ChipKind.COLOR, color: ChipColor.RED };
  private _row: number;
  private _col: number;

  prevRow: number;
  prevCol: number;

  get data() {
    return this._data;
  }

  get chipId() {
    return this._chipId;
  }

  set row(value: number) {
    this.prevRow = this._row;
    this._row = value;
  }

  set col(value: number) {
    this.prevCol = this._col;
    this._col = value;
  }

  get row() {
    return this._row;
  }

  get col() {
    return this._col;
  }

  init(id: string, data: ChipData, row: number, col: number) {
    this._chipId = id;
    this._data = data;
    this.row = row;
    this.col = col;
    this.prevRow = row;
    this.prevCol = col;
    this.updateVisual();
  }

  setSize(size: number) {
    this.node.getComponent(UITransform)?.setContentSize(size, size);
  }

  private updateVisual() {
    const sprite = this.getComponent(Sprite);
    if (!sprite) {
      console.error('No Sprite component on chip node!');
      return;
    }

    const key = this._data.kind === ChipKind.COLOR ? this._data.color : this._data.power;
    const path = CHIP_SPRITE_PATHS[key];
    console.log('Loading sprite:', path);

    resources.load(path, SpriteFrame, (err, spriteFrame) => {
      if (err) {
        console.error('Failed to load sprite:', path, err);
        return;
      }
      console.log('Sprite loaded:', path);
      sprite.spriteFrame = spriteFrame;
      sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    });
  }
}
