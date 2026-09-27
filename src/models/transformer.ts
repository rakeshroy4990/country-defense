import * as THREE from 'three';
import { box, std } from './shapes.ts';

export function makeTransformer(color: number, scale: number, kit: string): THREE.Group {
  const root = new THREE.Group();
  const accent = kitAccent(kit);
  root.add(box(0.58, 0.24, 0.78, 0x1c1d1f, -0.4, 0.14, 0.1));
  root.add(box(0.58, 0.24, 0.78, 0x1c1d1f, 0.4, 0.14, 0.1));
  root.add(box(0.5, 0.9, 0.5, color, -0.4, 0.78, 0.02));
  root.add(box(0.5, 0.9, 0.5, color, 0.4, 0.78, 0.02));
  root.add(box(0.54, 0.72, 0.52, color, -0.4, 1.52, 0.04, 0.55, 0.35));
  root.add(box(0.54, 0.72, 0.52, color, 0.4, 1.52, 0.04, 0.55, 0.35));
  root.add(box(1.2, 0.44, 0.66, 0x2a2c2e, 0, 1.98, 0));
  root.add(box(1.32, 1.42, 0.82, color, 0, 2.88, 0.08, 0.48, 0.42));
  root.add(box(1.42, 0.3, 0.9, accent, 0, 3.5, 0.12, 0.45, 0.35));
  root.add(box(0.44, 0.34, 0.12, 0x7ad7ff, -0.3, 2.92, 0.5, 0.18, 0.42));
  root.add(box(0.44, 0.34, 0.12, 0x7ad7ff, 0.3, 2.92, 0.5, 0.18, 0.42));
  root.add(box(0.58, 0.44, 0.58, accent, -1.02, 3.38, 0.06));
  root.add(box(0.58, 0.44, 0.58, accent, 1.02, 3.38, 0.06));
  root.add(box(0.42, 1.2, 0.42, color, -1.02, 2.62, 0.08));
  root.add(box(0.42, 1.2, 0.42, color, 1.02, 2.62, 0.08));
  root.add(box(0.5, 0.34, 0.5, 0x1c1d1f, -1.02, 1.95, 0.14));
  root.add(box(0.5, 0.34, 0.5, 0x1c1d1f, 1.02, 1.95, 0.14));
  root.add(box(0.76, 0.66, 0.68, 0x2c2e32, 0, 3.88, 0.1, 0.4, 0.5));
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.18, 0.16), std(0x7ad7ff, 0.15, 0.48));
  visor.position.set(0, 3.94, 0.42);
  visor.castShadow = true;
  root.add(visor);
  const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 2.05, 8), std(0x2a2a28, 0.35, 0.75));
  cannon.rotation.x = Math.PI / 2;
  cannon.position.set(1.02, 2.35, 1.22);
  cannon.castShadow = true;
  root.add(cannon);
  dressKit(root, kit, accent);
  root.scale.setScalar(scale);
  return root;
}

export function muzzleLocal(scale: number): THREE.Vector3 {
  return new THREE.Vector3(1.02 * scale, 2.35 * scale, 2.3 * scale);
}

function kitAccent(kit: string): number {
  if (kit === 'starscream') return 0x8b1e1e;
  if (kit === 'bonecrusher') return 0xc2a032;
  if (kit === 'barricade') return 0xc9a227;
  if (kit === 'shockwave') return 0x6b2a9a;
  return 0x1a1c1e;
}

function dressKit(root: THREE.Group, kit: string, accent: number): void {
  if (kit === 'starscream') {
    root.add(box(2.25, 0.08, 0.92, 0x8a9098, -0.22, 3.05, -0.55, 0.4, 0.55));
    root.add(box(2.25, 0.08, 0.92, 0x8a9098, 0.22, 3.28, -0.55, 0.4, 0.55));
    root.add(box(0.38, 0.24, 1.2, accent, 0, 2.7, -0.95, 0.4, 0.4));
    return;
  }
  if (kit === 'barricade') {
    root.add(box(1.28, 0.16, 0.3, 0xc9a227, 0, 3.66, 0.14, 0.35, 0.4));
    root.add(box(0.24, 0.2, 0.24, 0xff3344, -0.34, 3.74, 0.32));
    root.add(box(0.24, 0.2, 0.24, 0x3366ff, 0.34, 3.74, 0.32));
    return;
  }
  if (kit === 'bonecrusher') {
    root.add(box(1.95, 0.6, 0.24, accent, 0, 2.5, 0.68, 0.55, 0.25));
    root.add(box(0.38, 0.95, 0.38, 0x3a3220, -1.22, 2.25, 0.38));
    return;
  }
  if (kit === 'shockwave') {
    root.add(box(0.58, 0.58, 0.9, 0x2a1838, 0, 3.96, 0.46, 0.35, 0.5));
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.14, 0.2, 10), std(0x4a2a68, 0.4, 0.55));
    dish.rotation.x = Math.PI / 2;
    dish.position.set(-1.05, 3.55, 0.18);
    dish.castShadow = true;
    root.add(dish);
    return;
  }
  root.add(box(0.74, 0.68, 1.85, 0x4a4e52, 1.12, 2.4, 0.92, 0.4, 0.6));
  root.add(box(0.92, 0.3, 0.74, 0x8a9096, 0, 4.32, 0.1, 0.4, 0.55));
  root.add(box(1.48, 0.14, 0.74, 0x2a2c2e, 0, 1.68, 0.06));
}
