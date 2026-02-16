export enum ChipColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  ORANGE = 'orange',
  PURPLE = 'purple',
  TEAL = 'teal',
}

export enum ChipKind {
  COLOR = 'color',
  POWER = 'power',
}

export enum ChipPower {
  BOMB = 'bomb',
}

export type ChipData =
  | { kind: ChipKind.COLOR; color: ChipColor }
  | { kind: ChipKind.POWER; power: ChipPower };
