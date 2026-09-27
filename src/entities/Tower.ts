import * as THREE from 'three';
import type { TowerDef, TowerKind } from '../data/towers.ts';
import { makeTurret } from '../models/turret.ts';
import type { Enemy } from './Enemy.ts';
import { Projectile } from './Projectile.ts';

export class Tower {
  readonly mesh: THREE.Group;
  readonly cellKey: string;
  readonly kind: TowerKind;
  range: number;
  damage: number;
  fireRateMs: number;
  level = 1;
  private cooldown = 0;

  constructor(def: TowerDef, x: number, z: number, cellKey: string) {
    this.kind = def.kind;
    this.range = def.range;
    this.damage = def.damage;
    this.fireRateMs = def.fireRateMs;
    this.cellKey = cellKey;
    this.mesh = new THREE.Group();
    this.mesh.position.set(x, 0, z);
    this.mesh.add(makeTurret(def.color));
    this.mesh.userData.tower = true;
  }

  upgradeCost(): number {
    return 25 + this.level * 20;
  }

  upgrade(): void {
    this.level += 1;
    this.damage += 3;
    this.range += 4;
    this.mesh.scale.setScalar(1 + (this.level - 1) * 0.08);
  }

  update(delta: number, enemies: readonly Enemy[]): Projectile | null {
    this.cooldown = Math.max(0, this.cooldown - delta * 1000);
    if (this.cooldown > 0) {
      return null;
    }
    const target = nearestInRange(this.mesh.position, this.range, enemies);
    if (!target) {
      return null;
    }
    this.cooldown = this.fireRateMs;
    const from = this.mesh.position.clone();
    from.y += 3.1;
    return new Projectile(from, target, this.damage);
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) {
        return;
      }
      obj.geometry.dispose();
      if (obj.material instanceof THREE.Material) {
        obj.material.dispose();
      }
    });
  }
}

function nearestInRange(
  origin: THREE.Vector3,
  range: number,
  enemies: readonly Enemy[],
): Enemy | null {
  let best: Enemy | null = null;
  let bestDist = range;
  for (const enemy of enemies) {
    if (!enemy.alive) {
      continue;
    }
    const dist = origin.distanceTo(enemy.mesh.position);
    if (dist <= bestDist) {
      best = enemy;
      bestDist = dist;
    }
  }
  return best;
}

