import { findConnectedColor } from './findConnectedColor.ts';
import { findConnectedPower } from './findConnectedPower.ts';
import { ChipKind } from '../../../chip/types.ts';
import { Chip } from './../../../chip/Chip.ts';
import { Grid } from '../../types.ts';

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

  if (chip.data.kind === ChipKind.POWER) {
    return findConnectedPower(grid, startRow, startCol);
  }

  const connectedChips = findConnectedColor(grid, startRow, startCol);

  return connectedChips.length < 3 ? [] : connectedChips;
};
