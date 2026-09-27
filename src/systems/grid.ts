import { GRID_SIZE, MAP_DEPTH, MAP_WIDTH } from '../data/constants.ts';

export function snap(v: number): number {
  return Math.round(v / GRID_SIZE) * GRID_SIZE;
}

export function keyOf(x: number, z: number): string {
  return `${x}:${z}`;
}

export function inMap(x: number, z: number): boolean {
  return Math.abs(x) <= MAP_WIDTH / 2 - GRID_SIZE && Math.abs(z) <= MAP_DEPTH / 2 - GRID_SIZE;
}
