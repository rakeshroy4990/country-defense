import * as THREE from 'three';
import { box, std } from './shapes.ts';

export function makeTransformer(color: number, scale: number, kit: string): THREE.Group {
  const root = new THREE.Group();
  const accent = kit === 'starscream' ? 0x8b1e1e : kit === 'bonecrusher' ? 0xc2a032 : 0x1a1c1e;
  root.add(box(0.42, 1.05, 0.42, color, -0.32, 0.72, 0));
  root.add(box(0.42, 1.05, 0.42, color, 0.32, 0.72, 0));
  root.add(box(0.95, 0.38, 0.55, 0x2a2c2e, 0, 1.28, 0));
  root.add(box(1.05, 1.15, 0.7, color, 0, 2.05, 0.05, 0.5, 0.4));
  root.add(box(1.15, 0.22, 0.78, accent, 0, 2.55, 0.08, 0.45, 0.35));
  root.add(box(0.38, 1.05, 0.38, color, -0.78, 1.95, 0.05));
  root.add(box(0.38, 1.05, 0.38, color, 0.78, 1.95, 0.05));
  root.add(box(0.7, 0.55, 0.62, 0x2c2e32, 0, 2.85, 0.06, 0.4, 0.5));
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.16), std(0x7ad7ff, 0.2, 0.35));
  visor.position.set(0, 2.9, 0.34);
  root.add(visor);
  const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 1.7, 8), std(0x2a2a28, 0.35, 0.75));
  cannon.rotation.x = Math.PI / 2;
  cannon.position.set(0.72, 2.05, 1.05);
  cannon.castShadow = true;
  root.add(cannon);
  if (kit === 'starscream') {
    root.add(box(1.8, 0.08, 0.7, 0x8a9098, -0.15, 2.2, -0.45, 0.4, 0.55));
    root.add(box(1.8, 0.08, 0.7, 0x8a9098, 0.15, 2.35, -0.45, 0.4, 0.55));
  }
  if (kit === 'megatron') {
    root.add(box(0.55, 0.55, 1.4, 0x4a4e52, 0.85, 2.05, 0.7, 0.4, 0.6));
  }
  root.scale.setScalar(scale);
  return root;
}

export function muzzleLocal(scale: number): THREE.Vector3 {
  return new THREE.Vector3(0.72 * scale, 2.05 * scale, 1.9 * scale);
}
