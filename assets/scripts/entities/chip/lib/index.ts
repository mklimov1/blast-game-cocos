import { ChipColor } from '../types.ts';

const COLORS = Object.values(ChipColor);

export const getRandomBlockColor = (maxColors: number): ChipColor =>
  COLORS[Math.floor(Math.random() * maxColors)];

export const getColorByIndex = (index: number): ChipColor => COLORS[index];
