export interface WaveConfig {
  count: number;
  enemyHpMultiplier: number;
  spawnIntervalMs: number;
}

export const TEST_WAVES: WaveConfig[] = [
  { count: 6, enemyHpMultiplier: 1, spawnIntervalMs: 900 },
  { count: 8, enemyHpMultiplier: 1.25, spawnIntervalMs: 750 },
  { count: 10, enemyHpMultiplier: 1.55, spawnIntervalMs: 620 },
];
