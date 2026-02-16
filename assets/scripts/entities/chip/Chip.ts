import { _decorator, Component, Sprite, SpriteFrame, resources } from 'cc';
import { ChipData, ChipKind, ChipColor } from './types';
import { CHIP_SPRITE_PATHS } from './constants';

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

  private updateVisual() {
    const sprite = this.getComponent(Sprite);
    if (!sprite) return;

    const key = this._data.kind === ChipKind.COLOR ? this._data.color : this._data.power;

    resources.load(CHIP_SPRITE_PATHS[key], SpriteFrame, (err, spriteFrame) => {
      if (!err) sprite.spriteFrame = spriteFrame;
    });
  }
}
