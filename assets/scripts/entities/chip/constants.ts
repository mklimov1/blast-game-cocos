import { ChipColor, ChipPower } from './types.ts';

export const CHIP_SPRITE_PATHS: Record<ChipColor | ChipPower, string> = {
  [ChipColor.RED]: 'sprites/chips/red/spriteFrame',
  [ChipColor.BLUE]: 'sprites/chips/blue/spriteFrame',
  [ChipColor.GREEN]: 'sprites/chips/green/spriteFrame',
  [ChipColor.ORANGE]: 'sprites/chips/orange/spriteFrame',
  [ChipColor.PURPLE]: 'sprites/chips/purple/spriteFrame',
  [ChipColor.TEAL]: 'sprites/chips/teal/spriteFrame',

  [ChipPower.BOMB]: 'sprites/chips/bomb/spriteFrame',
};
