import type { Position } from '../types.ts';

export const sortByDistance = <T extends { row: number; col: number }>(
  chips: T[],
  center: Position,
): T[] => {
  return [...chips].sort((a, b) => {
    const da = Math.abs(a.row - center.row) + Math.abs(a.col - center.col);
    const db = Math.abs(b.row - center.row) + Math.abs(b.col - center.col);
    return da - db;
  });
};
