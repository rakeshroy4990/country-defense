import * as THREE from 'three';
import type { Enemy } from './Enemy.ts';

const FLIGHT_SEC = 0.28;

export class Projectile {
  readonly mesh: THREE.Mesh;
  done = false;
  hit = false;
  private elapsed = 0;
  private readonly from: THREE.Vector3;
  private readonly target: Enemy;
  private readonly damage: number;
  private readonly lastAim = new THREE.Vector3();

  constructor(from: THREE.Vector3, target: Enemy, damage: number) {
    this.from = from.clone();
    this.target = target;
    this.damage = damage;
    this.lastAim.copy(target.mesh.position).setY(1.5);
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffd27a }),
    );
    this.mesh.position.copy(this.from);
  }

  update(delta: number): void {
    if (this.done) {
      return;
    }
    if (this.target.alive) {
      this.lastAim.copy(this.target.mesh.position).setY(1.5);
    }
    this.elapsed += delta;
    const t = Math.min(1, this.elapsed / FLIGHT_SEC);
    this.mesh.position.lerpVectors(this.from, this.lastAim, t);
    if (t < 1) {
      return;
    }
    this.done = true;
    if (this.target.alive) {
      this.target.takeDamage(this.damage);
      this.hit = true;
    }
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    const mat = this.mesh.material;
    if (mat instanceof THREE.Material) {
      mat.dispose();
    }
  }
}
