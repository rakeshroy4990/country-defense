import type * as THREE from 'three';
import { TEST_WAVES, type WaveConfig } from '../data/waves.ts';
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
  private waveIndex = -1;
  private spawned = 0;
  private spawnAcc = 0;
  private running = false;
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

  get currentWave(): number { return Math.max(1, this.waveIndex + 1); }

  get totalWaves(): number { return this.waves.length; }

  get enemiesRemaining(): number {
    const wave = this.waves[this.waveIndex];
    if (!wave) {
      return 0;
    }
    return wave.count - this.spawned + this.enemies.length;
  }

  start(): void {
    this.clearAll();
    this.running = true;
    this.beginWave(0);
  }

  stop(): void { this.running = false; }

  update(delta: number): void {
    if (!this.running) return;
    this.tickSpawns(delta);
    this.tickEnemies(delta);
  }

  clearAll(): void {
    for (const enemy of this.enemies) {
      enemy.dispose();
    }
    this.enemies.length = 0;
    this.waveIndex = -1;
    this.spawned = 0;
    this.spawnAcc = 0;
    this.running = false;
  }

  private beginWave(index: number): void {
    this.waveIndex = index;
    this.spawned = 0;
    this.spawnAcc = 0;
    this.callbacks.onWaveStarted(this.currentWave, this.totalWaves);
  }

  private tickSpawns(delta: number): void {
    const wave = this.waves[this.waveIndex];
    if (!wave || this.spawned >= wave.count) {
      return;
    }
    this.spawnAcc += delta * 1000;
    while (this.spawned < wave.count && this.spawnAcc >= wave.spawnIntervalMs) {
      this.spawnAcc -= wave.spawnIntervalMs;
      this.spawnOne(wave);
    }
  }

  private spawnOne(wave: WaveConfig): void {
    const enemy = new Enemy(Math.round(BASE_HP * wave.enemyHpMultiplier), BASE_SPEED);
    enemy.update(0, this.path, this.pathLength);
    this.scene.add(enemy.mesh);
    this.enemies.push(enemy);
    this.spawned += 1;
  }

  private tickEnemies(delta: number): void {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (!enemy) {
        continue;
      }
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
    this.checkWaveClear();
  }

  private checkWaveClear(): void {
    const wave = this.waves[this.waveIndex];
    if (!wave || this.spawned < wave.count || this.enemies.length > 0) {
      return;
    }
    this.callbacks.onWaveCleared(this.currentWave);
    const next = this.waveIndex + 1;
    if (next < this.waves.length) {
      this.beginWave(next);
      return;
    }
    this.running = false;
    this.callbacks.onAllWavesCleared();
  }
}
