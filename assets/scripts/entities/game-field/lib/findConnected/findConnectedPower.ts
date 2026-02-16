import { findConnectedBomb } from './findConnectedBomb';
import { ChipKind, ChipPower, type Grid } from '../../types';
import { Chip } from '../entities/Chip';

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
  if (chip.kind !== ChipKind.POWER) return [chip];

  if (chip.type === ChipPower.BOMB) {
    return findConnectedBomb(grid, startRow, startCol, visited);
  }

  return [];
};
