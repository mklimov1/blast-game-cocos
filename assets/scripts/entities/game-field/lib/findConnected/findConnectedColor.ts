import { ChipKind, Color, type Grid, type Position } from '../../types';
import { Chip } from '../entities/Chip';

export const findConnectedColor = (
  grid: Grid,
  startRow: number,
  startCol: number,
  visited: Set<string> = new Set<string>(),
): Chip[] => {
  const key = `${startRow},${startCol}`;
  if (visited.has(key)) return [];

  visited.add(key);

  const targetBlock = grid[startRow][startCol];
  if (!targetBlock) return [];
  if (targetBlock.kind !== ChipKind.COLOR) return [];

  const color = targetBlock.type as Color;

  const neighbors: Position[] = [
    { row: startRow - 1, col: startCol },
    { row: startRow + 1, col: startCol },
    { row: startRow, col: startCol - 1 },
    { row: startRow, col: startCol + 1 },
  ];

  const connected: Chip[] = [];

  for (const { row, col } of neighbors) {
    const block = grid?.[row]?.[col];
    const neighborKey = `${row},${col}`;

    if (!block || block.type !== color || visited.has(neighborKey)) continue;

    connected.push(...findConnectedColor(grid, row, col, visited));
  }

  return [targetBlock, ...connected];
};
