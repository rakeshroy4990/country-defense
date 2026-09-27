import * as THREE from 'three';
import type { Enemy } from './Enemy.ts';

const FLIGHT_SEC = 0.16;

export class Projectile {
  readonly mesh: THREE.Mesh;
  done = false;
  hit = false;
  private elapsed = 0;
  private readonly from: THREE.Vector3;
  private readonly damage: number;
  private readonly enemy: Enemy | null;
  private readonly lastAim = new THREE.Vector3();

  constructor(from: THREE.Vector3, aim: THREE.Vector3, damage: number, enemy: Enemy | null) {
    this.from = from.clone();
    this.damage = damage;
    this.enemy = enemy;
    this.lastAim.copy(aim);
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.07, 0.85, 6),
      new THREE.MeshStandardMaterial({
        color: 0xffc14a,
        emissive: 0xff7a1a,
        emissiveIntensity: 1.4,
        roughness: 0.25,
        metalness: 0.55,
      }),
    );
    this.mesh.position.copy(this.from);
    aimMesh(this.mesh, this.from, this.lastAim);
  }

  update(delta: number): void {
    if (this.done) return;
    if (this.enemy?.alive) {
      this.lastAim.copy(this.enemy.mesh.position).setY(1.8);
    }
    this.elapsed += delta;
    const t = Math.min(1, this.elapsed / FLIGHT_SEC);
    this.mesh.position.lerpVectors(this.from, this.lastAim, t);
    aimMesh(this.mesh, this.from, this.lastAim);
    if (t < 1) return;
    this.done = true;
    if (this.enemy?.alive) {
      this.enemy.takeDamage(this.damage);
      this.hit = true;
    }
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    if (this.mesh.material instanceof THREE.Material) this.mesh.material.dispose();
  }
}

function aimMesh(mesh: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3): void {
  const dir = to.clone().sub(from);
  if (dir.lengthSq() < 0.0001) return;
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
}
