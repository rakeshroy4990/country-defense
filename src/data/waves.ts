export interface WaveConfig {
  count: number;
  enemyHpMultiplier: number;
  spawnIntervalMs: number;
}

export const TEST_WAVES: WaveConfig[] = [
  { count: 5, enemyHpMultiplier: 1, spawnIntervalMs: 950 },
  { count: 6, enemyHpMultiplier: 1.1, spawnIntervalMs: 880 },
  { count: 8, enemyHpMultiplier: 1.2, spawnIntervalMs: 800 },
  { count: 9, enemyHpMultiplier: 1.35, spawnIntervalMs: 740 },
  { count: 10, enemyHpMultiplier: 1.5, spawnIntervalMs: 680 },
  { count: 12, enemyHpMultiplier: 1.7, spawnIntervalMs: 620 },
  { count: 14, enemyHpMultiplier: 1.95, spawnIntervalMs: 560 },
  { count: 16, enemyHpMultiplier: 2.2, spawnIntervalMs: 500 },
  { count: 18, enemyHpMultiplier: 2.55, spawnIntervalMs: 460 },
  { count: 20, enemyHpMultiplier: 3, spawnIntervalMs: 420 },
];
