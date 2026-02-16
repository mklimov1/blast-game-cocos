import { findConnectedPower } from './findConnectedPower.ts';
import { type Grid, type Position } from '../../types.ts';
import { Chip } from './../../../chip/Chip.ts';
import { ChipKind, ChipPower } from '../../../chip/types.ts';

export const findConnectedBomb = (
  grid: Grid,
  startRow: number,
  startCol: number,
  visited: Set<string> = new Set<string>(),
): Chip[] => {
  const key = `${startRow},${startCol}`;
  if (visited.has(key)) return [];

  visited.add(key);

  const bomb = grid[startRow][startCol];
  if (!bomb) return [];
  if (bomb.data.kind === ChipKind.POWER && bomb.data.power !== ChipPower.BOMB) return [];

  const neighbors: Position[] = [
    { row: startRow - 1, col: startCol },
    { row: startRow + 1, col: startCol },
    { row: startRow, col: startCol - 1 },
    { row: startRow, col: startCol + 1 },

    { row: startRow - 1, col: startCol - 1 },
    { row: startRow - 1, col: startCol + 1 },
    { row: startRow + 1, col: startCol - 1 },
    { row: startRow + 1, col: startCol + 1 },
  ];

  const connected: Chip[] = [];

  for (const { row, col } of neighbors) {
    const chip = grid?.[row]?.[col];
    const neighborKey = `${row},${col}`;

    if (!chip || visited.has(neighborKey)) continue;
    connected.push(...findConnectedPower(grid, row, col, visited));
  }

  return [bomb, ...connected];
};
