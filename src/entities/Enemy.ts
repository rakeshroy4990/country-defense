import * as THREE from 'three';
import type { AttackerDef } from '../data/attackers.ts';
import { makeTransformer } from '../models/tank.ts';

export class Enemy {
  readonly mesh: THREE.Group;
  readonly name: string;
  readonly kingdomDamage: number;
  readonly reward: number;
  hp: number;
  maxHp: number;
  speed: number;
  progress = 0;
  reachedCapital = false;
  dying = false;
  rewarded = false;
  private deathT = 0;

  constructor(def: AttackerDef) {
    this.name = def.name;
    this.kingdomDamage = def.kingdomDamage;
    this.reward = def.reward;
    this.maxHp = def.hp;
    this.hp = def.hp;
    this.speed = def.speed;
    this.mesh = new THREE.Group();
    this.mesh.add(makeTransformer(def.color, def.scale));
  }

  get alive(): boolean {
    return this.hp > 0 && !this.reachedCapital && !this.dying;
  }

  update(delta: number, path: THREE.CatmullRomCurve3, pathLength: number): void {
    if (!this.alive) return;
    this.progress = Math.min(1, this.progress + (this.speed * delta) / pathLength);
    if (this.progress >= 1) {
      this.reachedCapital = true;
      return;
    }
    const pos = path.getPointAt(this.progress);
    const tan = path.getTangentAt(this.progress);
    this.mesh.position.set(pos.x, 0.12, pos.z);
    this.mesh.rotation.y = Math.atan2(tan.x, tan.z);
  }

  takeDamage(amount: number): void {
    if (!this.alive) return;
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) this.dying = true;
  }

  updateDeath(delta: number): boolean {
    this.deathT += delta;
    this.mesh.position.y -= delta * 1.4;
    return this.deathT >= 0.28;
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.geometry.dispose();
      const mat = obj.material;
      if (Array.isArray(mat)) mat.forEach((item) => item.dispose());
      else mat.dispose();
    });
  }
}
