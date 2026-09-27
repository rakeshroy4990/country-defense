import * as THREE from 'three';
import { ENEMY_REWARD } from '../data/constants.ts';

export class Enemy {
  readonly mesh: THREE.Group;
  hp: number;
  maxHp: number;
  speed: number;
  progress = 0;
  reward = ENEMY_REWARD;
  reachedCapital = false;
  dying = false;
  rewarded = false;
  private deathT = 0;

  constructor(hp: number, speed: number) {
    this.maxHp = hp;
    this.hp = hp;
    this.speed = speed;
    this.mesh = new THREE.Group();
    this.mesh.add(makeCapsuleBody());
  }

  get alive(): boolean {
    return this.hp > 0 && !this.reachedCapital && !this.dying;
  }

  update(delta: number, path: THREE.CatmullRomCurve3, pathLength: number): void {
    if (!this.alive) {
      return;
    }
    this.progress = Math.min(1, this.progress + (this.speed * delta) / pathLength);
    if (this.progress >= 1) {
      this.reachedCapital = true;
      return;
    }
    const t = this.progress;
    const pos = path.getPointAt(t);
    const tan = path.getTangentAt(t);
    this.mesh.position.copy(pos);
    this.mesh.lookAt(pos.x + tan.x, pos.y, pos.z + tan.z);
  }

  takeDamage(amount: number): void {
    if (!this.alive) {
      return;
    }
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.dying = true;
    }
  }

  updateDeath(delta: number): boolean {
    this.deathT += delta;
    const scale = Math.max(0, 1 - this.deathT / 0.35);
    this.mesh.scale.setScalar(scale);
    return this.deathT >= 0.35;
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) {
        return;
      }
      obj.geometry.dispose();
      disposeMaterial(obj.material);
    });
  }
}

function makeCapsuleBody(): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.85, 1.5, 4, 8),
    new THREE.MeshLambertMaterial({ color: 0xc23b3b }),
  );
  mesh.position.y = 1.6;
  mesh.castShadow = true;
  return mesh;
}

function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(material)) {
    for (const item of material) {
      item.dispose();
    }
    return;
  }
  material.dispose();
}
