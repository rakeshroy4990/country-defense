import type * as THREE from 'three';
import type { Enemy } from '../entities/Enemy.ts';
import { Projectile } from '../entities/Projectile.ts';
import type { Tower } from '../entities/Tower.ts';

export class CombatSystem {
  readonly projectiles: Projectile[] = [];
  private readonly scene: THREE.Scene;
  private readonly capital: THREE.Vector3;
  private readonly onShoot: () => void;
  private readonly onImpact: (at: THREE.Vector3) => void;

  constructor(
    scene: THREE.Scene,
    capital: THREE.Vector3,
    onShoot: () => void,
    onImpact: (at: THREE.Vector3) => void,
  ) {
    this.scene = scene;
    this.capital = capital;
    this.onShoot = onShoot;
    this.onImpact = onImpact;
  }

  update(delta: number, towers: readonly Tower[], enemies: readonly Enemy[]): void {
    for (const tower of towers) {
      const shot = tower.update(delta, enemies);
      if (!shot) continue;
      this.scene.add(shot.mesh);
      this.projectiles.push(shot);
      this.onShoot();
    }
    for (const enemy of enemies) {
      const shot = enemy.tryFire(delta, this.capital);
      if (!shot) continue;
      this.scene.add(shot.mesh);
      this.projectiles.push(shot);
    }
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const shot = this.projectiles[i];
      if (!shot) {
        continue;
      }
      shot.update(delta);
      if (shot.done) {
        if (shot.hit) this.onImpact(shot.mesh.position.clone());
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
