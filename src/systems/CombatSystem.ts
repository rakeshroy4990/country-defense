import type * as THREE from 'three';
import type { Enemy } from '../entities/Enemy.ts';
import { Projectile } from '../entities/Projectile.ts';
import type { Tower } from '../entities/Tower.ts';

export class CombatSystem {
  readonly projectiles: Projectile[] = [];
  private readonly scene: THREE.Scene;
  private readonly onShoot: () => void;

  constructor(scene: THREE.Scene, onShoot: () => void) {
    this.scene = scene;
    this.onShoot = onShoot;
  }

  update(delta: number, towers: readonly Tower[], enemies: readonly Enemy[]): void {
    for (const tower of towers) {
      const shot = tower.update(delta, enemies);
      if (!shot) {
        continue;
      }
      this.scene.add(shot.mesh);
      this.projectiles.push(shot);
      this.onShoot();
    }
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const shot = this.projectiles[i];
      if (!shot) {
        continue;
      }
      shot.update(delta);
      if (shot.done) {
        shot.dispose();
        this.projectiles.splice(i, 1);
      }
    }
  }

  clearAll(): void {
    for (const shot of this.projectiles) {
      shot.dispose();
    }
    this.projectiles.length = 0;
  }
}
