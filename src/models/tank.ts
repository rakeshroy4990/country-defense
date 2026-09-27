import * as THREE from 'three';
import { box, std } from './shapes.ts';

export function makeTransformer(color: number, scale: number): THREE.Group {
  const group = new THREE.Group();
  group.add(box(1.5, 0.7, 2.4, color, 0, 1.15, 0, 0.55, 0.45));
  group.add(box(0.45, 1.1, 0.45, color, -0.95, 1.1, 0.2, 0.6, 0.35));
  group.add(box(0.45, 1.1, 0.45, color, 0.95, 1.1, 0.2, 0.6, 0.35));
  group.add(box(1.1, 0.7, 1.1, 0x2c2e30, 0, 1.85, 0.1, 0.4, 0.55));
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.2), std(0x7ad0ff, 0.25, 0.4));
  visor.position.set(0, 1.95, 0.55);
  group.add(visor);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 1.6, 8), std(0x2a2a28, 0.4, 0.7));
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 1.55, 1.35);
  barrel.castShadow = true;
  group.add(barrel);
  group.scale.setScalar(scale);
  return group;
}
