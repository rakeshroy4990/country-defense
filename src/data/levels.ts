export interface LevelWave {
  attackerId: string;
  count: number;
  spawnIntervalMs: number;
  startAtMs: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  speedScale: number;
  waves: LevelWave[];
}

export interface WaveRuntime {
  config: LevelWave;
  spawned: number;
  spawnAcc: number;
  started: boolean;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Sky Raid',
    speedScale: 0.4,
    waves: [{ attackerId: 'starscream', count: 6, spawnIntervalMs: 1800, startAtMs: 0 }],
  },
  {
    id: 2,
    name: 'Street Sweep',
    speedScale: 0.62,
    waves: [
      { attackerId: 'starscream', count: 4, spawnIntervalMs: 700, startAtMs: 0 },
      { attackerId: 'barricade', count: 5, spawnIntervalMs: 900, startAtMs: 6000 },
    ],
  },
  {
    id: 3,
    name: 'Wrecking Crew',
    speedScale: 0.85,
    waves: [
      { attackerId: 'barricade', count: 5, spawnIntervalMs: 800, startAtMs: 0 },
      { attackerId: 'bonecrusher', count: 4, spawnIntervalMs: 1400, startAtMs: 8000 },
    ],
  },
  {
    id: 4,
    name: 'Purple Pulse',
    speedScale: 1.15,
    waves: [
      { attackerId: 'starscream', count: 6, spawnIntervalMs: 650, startAtMs: 0 },
      { attackerId: 'shockwave', count: 3, spawnIntervalMs: 1600, startAtMs: 7000 },
    ],
  },
  {
    id: 5,
    name: 'Megatron Falls',
    speedScale: 1.45,
    waves: [
      { attackerId: 'barricade', count: 6, spawnIntervalMs: 750, startAtMs: 0 },
      { attackerId: 'bonecrusher', count: 3, spawnIntervalMs: 1200, startAtMs: 8000 },
      { attackerId: 'megatron', count: 2, spawnIntervalMs: 4000, startAtMs: 14000 },
    ],
  },
];
