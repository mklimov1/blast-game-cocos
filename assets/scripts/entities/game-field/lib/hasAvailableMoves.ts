import { findConnected } from './findConnected/findConnected.ts';

import type { Grid } from '../types.ts';

export const hasAvailableMoves = (grid: Grid): boolean => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const chips = findConnected(grid, row, col);
      if (chips.length) return true;
    }
  }
  return false;
};
