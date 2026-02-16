import { instantiate, Prefab } from 'cc';
import { ChipData } from '../../entities/chip/types.ts';
import { Chip } from '../../entities/chip/Chip.ts';

export const createChip = (
  prefab: Prefab,
  id: string,
  data: ChipData,
  row: number,
  col: number,
): Chip => {
  const node = instantiate(prefab);
  const chip = node.getComponent(Chip)!;
  chip.init(id, data, row, col);
  return chip;
};
