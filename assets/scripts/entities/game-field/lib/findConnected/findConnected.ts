import { findConnectedColor } from './findConnectedColor';
import { findConnectedPower } from './findConnectedPower';
import { ChipKind, type Grid } from '../../types';
import { Chip } from '../entities/Chip';

export const findConnected = (
  grid: Grid,
  startRow: number,
  startCol: number,
  visited: Set<string> = new Set<string>(),
): Chip[] => {
  const key = `${startRow},${startCol}`;
  if (visited.has(key)) return [];

  const chip = grid[startRow][startCol];
  if (!chip) return [];

  if (chip.kind === ChipKind.POWER) {
    return findConnectedPower(grid, startRow, startCol);
  }

  const connectedChips = findConnectedColor(grid, startRow, startCol);

  return connectedChips.length < 3 ? [] : connectedChips;
};
