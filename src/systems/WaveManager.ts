import type * as THREE from 'three';
import { attackerById } from '../data/attackers.ts';
import { LEVELS, type LevelConfig, type WaveRuntime } from '../data/levels.ts';
import { Enemy } from '../entities/Enemy.ts';
import { tickEnemies } from './enemyTick.ts';

export interface WaveCallbacks {
  onLevelStarted: (level: number, total: number, name: string) => void;
  onWaveStarted: (attackerName: string) => void;
  onEnemyReachedCapital: (enemy: Enemy) => void;
  onEnemyKilled: (enemy: Enemy) => void;
  onAllWavesCleared: () => void;
}

const LEVEL_GAP_SEC = 2.6;

export class WaveManager {
  readonly enemies: Enemy[] = [];
  private elapsed = 0;
  private running = false;
  private levelIndex = 0;
  private gap = 0;
  private incoming = '';
  private runtimes: WaveRuntime[] = [];
  private readonly scene: THREE.Scene;
  private readonly path: THREE.CatmullRomCurve3;
  private readonly pathLength: number;
  private readonly levels: LevelConfig[];
  private readonly callbacks: WaveCallbacks;

  constructor(
    scene: THREE.Scene,
    path: THREE.CatmullRomCurve3,
    pathLength: number,
    callbacks: WaveCallbacks,
    levels: LevelConfig[] = LEVELS,
  ) {
    this.scene = scene;
    this.path = path;
    this.pathLength = pathLength;
    this.callbacks = callbacks;
    this.levels = levels;
  }

  get currentLevel(): number { return this.levelIndex + 1; }
  get totalLevels(): number { return this.levels.length; }
  get levelName(): string { return this.levels[this.levelIndex]?.name ?? ''; }
  get incomingName(): string { return this.incoming; }

  get enemiesRemaining(): number {
    const pending = this.runtimes.reduce((n, rt) => n + (rt.config.count - rt.spawned), 0);
    return pending + this.enemies.length;
  }

  get waveProgress(): number {
    const total = this.runtimes.reduce((n, rt) => n + rt.config.count, 0);
    return total === 0 ? 0 : 1 - this.enemiesRemaining / total;
  }

  start(): void {
    this.clearAll();
    this.running = true;
    this.beginLevel(0);
  }

  stop(): void { this.running = false; }

  update(delta: number): void {
    if (!this.running) return;
    if (this.gap > 0) {
      this.gap -= delta;
      if (this.gap <= 0) this.beginLevel(this.levelIndex + 1);
      return;
    }
    this.elapsed += delta * 1000;
    this.tickSchedule();
    this.tickSpawns(delta);
    tickEnemies(this.enemies, delta, this.path, this.pathLength, this.callbacks.onEnemyKilled, this.callbacks.onEnemyReachedCapital);
    this.checkLevelClear();
  }

  clearAll(): void {
    for (const enemy of this.enemies) enemy.dispose();
    this.enemies.length = 0;
    this.runtimes = [];
    this.elapsed = 0;
    this.gap = 0;
    this.levelIndex = 0;
    this.incoming = '';
    this.running = false;
  }

  private beginLevel(index: number): void {
    const level = this.levels[index];
    if (!level) return;
    this.levelIndex = index;
    this.elapsed = 0;
    this.gap = 0;
    this.runtimes = level.waves.map((config) => ({
      config, spawned: 0, spawnAcc: config.spawnIntervalMs, started: false,
    }));
    this.incoming = attackerById(level.waves[0]?.attackerId ?? 'starscream').name;
    this.callbacks.onLevelStarted(this.currentLevel, this.totalLevels, level.name);
  }

  private tickSchedule(): void {
    for (const rt of this.runtimes) {
      if (rt.started || this.elapsed < rt.config.startAtMs) continue;
      rt.started = true;
      this.incoming = attackerById(rt.config.attackerId).name;
      this.callbacks.onWaveStarted(this.incoming);
    }
  }

  private tickSpawns(delta: number): void {
    for (const rt of this.runtimes) {
      if (!rt.started || rt.spawned >= rt.config.count) continue;
      rt.spawnAcc += delta * 1000;
      while (rt.spawned < rt.config.count && rt.spawnAcc >= rt.config.spawnIntervalMs) {
        rt.spawnAcc -= rt.config.spawnIntervalMs;
        const def = attackerById(rt.config.attackerId);
        const enemy = new Enemy(def);
        const scale = this.levels[this.levelIndex]?.speedScale ?? 1;
        enemy.speed = def.speed * scale;
        enemy.update(0, this.path, this.pathLength);
        this.scene.add(enemy.mesh);
        this.enemies.push(enemy);
        rt.spawned += 1;
      }
    }
  }

  private checkLevelClear(): void {
    const done = this.runtimes.every((rt) => rt.started && rt.spawned >= rt.config.count);
    if (!done || this.enemies.length > 0) return;
    if (this.levelIndex + 1 < this.levels.length) {
      this.gap = LEVEL_GAP_SEC;
      return;
    }
    this.running = false;
    this.callbacks.onAllWavesCleared();
  }
}
