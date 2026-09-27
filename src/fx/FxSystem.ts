import type * as THREE from 'three';
import { Burst } from './Burst.ts';

export class FxSystem {
  private readonly bursts: Burst[] = [];
  private readonly scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  spawn(at: THREE.Vector3, color: number): void {
    const burst = new Burst(at, color);
    this.scene.add(burst.points);
    this.bursts.push(burst);
  }

  update(delta: number): void {
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const burst = this.bursts[i];
      if (burst && burst.update(delta)) {
        burst.dispose();
        this.bursts.splice(i, 1);
      }
    }
  }

  clearAll(): void {
    for (const burst of this.bursts) {
      burst.dispose();
    }
    this.bursts.length = 0;
  }
}
