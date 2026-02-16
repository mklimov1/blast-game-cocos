import { ChipColor, ChipKind } from '../../../chip/types.ts';
import { type Grid, type Position } from '../../types.ts';
import { Chip } from './../../../chip/Chip.ts';

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
  if (targetBlock.data.kind !== ChipKind.COLOR) return [];

  const color = targetBlock.data.color as ChipColor;

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

    if (
      !block ||
      block.data.kind !== ChipKind.COLOR ||
      block.data.color !== color ||
      visited.has(neighborKey)
    )
      continue;

    connected.push(...findConnectedColor(grid, row, col, visited));
  }

  return [targetBlock, ...connected];
};
