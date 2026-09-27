import * as THREE from 'three';

const COUNT = 16;
const LIFE = 0.4;

export class Burst {
  readonly points: THREE.Points;
  private age = 0;
  private readonly velocities: THREE.Vector3[] = [];

  constructor(origin: THREE.Vector3, color: number) {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        3 + Math.random() * 6,
        (Math.random() - 0.5) * 10,
      );
      this.velocities.push(vel);
      positions[i * 3] = origin.x;
      positions[i * 3 + 1] = origin.y + 1;
      positions[i * 3 + 2] = origin.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color, size: 0.45, transparent: true, opacity: 1 }),
    );
  }

  update(delta: number): boolean {
    this.age += delta;
    const attr = this.points.geometry.getAttribute('position');
    for (let i = 0; i < COUNT; i++) {
      const vel = this.velocities[i];
      if (!vel) continue;
      vel.y -= 12 * delta;
      attr.setXYZ(
        i,
        attr.getX(i) + vel.x * delta,
        attr.getY(i) + vel.y * delta,
        attr.getZ(i) + vel.z * delta,
      );
    }
    attr.needsUpdate = true;
    const mat = this.points.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, 1 - this.age / LIFE);
    return this.age >= LIFE;
  }

  dispose(): void {
    this.points.removeFromParent();
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
