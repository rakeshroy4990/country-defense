import type * as THREE from 'three';
import { TEST_WAVES, type WaveConfig, type WaveRuntime } from '../data/waves.ts';
import { Enemy } from '../entities/Enemy.ts';

export interface WaveCallbacks {
  onWaveStarted: (wave: number, total: number) => void;
  onEnemyReachedCapital: (enemy: Enemy) => void;
  onEnemyKilled: (enemy: Enemy) => void;
  onWaveCleared: (wave: number) => void;
  onAllWavesCleared: () => void;
}

const BASE_HP = 10;
const BASE_SPEED = 11;

export class WaveManager {
  readonly enemies: Enemy[] = [];
  private elapsed = 0;
  private running = false;
  private runtimes: WaveRuntime[] = [];
  private readonly scene: THREE.Scene;
  private readonly path: THREE.CatmullRomCurve3;
  private readonly pathLength: number;
  private readonly waves: WaveConfig[];
  private readonly callbacks: WaveCallbacks;

  constructor(
    scene: THREE.Scene,
    path: THREE.CatmullRomCurve3,
    pathLength: number,
    callbacks: WaveCallbacks,
    waves: WaveConfig[] = TEST_WAVES,
  ) {
    this.scene = scene;
    this.path = path;
    this.pathLength = pathLength;
    this.callbacks = callbacks;
    this.waves = waves;
  }

  get currentWave(): number {
    const started = this.runtimes.filter((rt) => rt.started).length;
    return Math.max(1, started);
  }

  get totalWaves(): number { return this.waves.length; }

  get enemiesRemaining(): number {
    const pending = this.runtimes.reduce((n, rt) => n + (rt.config.count - rt.spawned), 0);
    return pending + this.enemies.length;
  }

  get waveProgress(): number {
    const total = this.waves.reduce((n, w) => n + w.count, 0);
    return total === 0 ? 0 : 1 - this.enemiesRemaining / total;
  }

  start(): void {
    this.clearAll();
    this.running = true;
    this.elapsed = 0;
    this.runtimes = this.waves.map((config) => ({
      config, spawned: 0, spawnAcc: config.spawnIntervalMs, started: false,
    }));
  }

  stop(): void { this.running = false; }

  update(delta: number): void {
    if (!this.running) return;
    this.elapsed += delta * 1000;
    this.tickSchedule();
    this.tickSpawns(delta);
    this.tickEnemies(delta);
    this.checkVictory();
  }

  clearAll(): void {
    for (const enemy of this.enemies) enemy.dispose();
    this.enemies.length = 0;
    this.runtimes = [];
    this.elapsed = 0;
    this.running = false;
  }

  private tickSchedule(): void {
    this.runtimes.forEach((rt, index) => {
      if (rt.started || this.elapsed < rt.config.startAtMs) return;
      rt.started = true;
      this.callbacks.onWaveStarted(index + 1, this.totalWaves);
    });
  }

  private tickSpawns(delta: number): void {
    for (const rt of this.runtimes) {
      if (!rt.started || rt.spawned >= rt.config.count) continue;
      rt.spawnAcc += delta * 1000;
      while (rt.spawned < rt.config.count && rt.spawnAcc >= rt.config.spawnIntervalMs) {
        rt.spawnAcc -= rt.config.spawnIntervalMs;
        this.spawnOne(rt);
      }
    }
  }

  private spawnOne(rt: WaveRuntime): void {
    const enemy = new Enemy(Math.round(BASE_HP * rt.config.enemyHpMultiplier), BASE_SPEED);
    enemy.update(0, this.path, this.pathLength);
    this.scene.add(enemy.mesh);
    this.enemies.push(enemy);
    rt.spawned += 1;
  }

  private tickEnemies(delta: number): void {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (!enemy) continue;
      if (enemy.dying) {
        if (!enemy.rewarded) {
          enemy.rewarded = true;
          this.callbacks.onEnemyKilled(enemy);
        }
        if (enemy.updateDeath(delta)) {
          enemy.dispose();
          this.enemies.splice(i, 1);
        }
        continue;
      }
      enemy.update(delta, this.path, this.pathLength);
      if (enemy.reachedCapital) {
        this.callbacks.onEnemyReachedCapital(enemy);
        enemy.dispose();
        this.enemies.splice(i, 1);
      }
    }
  }

  private checkVictory(): void {
    const allSpawned = this.runtimes.every((rt) => rt.started && rt.spawned >= rt.config.count);
    if (!allSpawned || this.enemies.length > 0) return;
    this.running = false;
    this.callbacks.onWaveCleared(this.totalWaves);
    this.callbacks.onAllWavesCleared();
  }
}
