import { findConnectedBomb } from './findConnectedBomb.ts';
import { type Grid } from '../../types.ts';
import { Chip } from './../../../chip/Chip.ts';
import { ChipKind, ChipPower } from '../../../chip/types.ts';

export const findConnectedPower = (
  grid: Grid,
  startRow: number,
  startCol: number,
  visited: Set<string> = new Set<string>(),
): Chip[] => {
  const key = `${startRow},${startCol}`;
  if (visited.has(key)) return [];

  const chip = grid[startRow][startCol];
  if (!chip) return [];
  if (chip.data.kind !== ChipKind.POWER) return [chip];

  if (chip.data.power === ChipPower.BOMB) {
    return findConnectedBomb(grid, startRow, startCol, visited);
  }

  return [];
};
