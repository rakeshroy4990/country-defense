import * as THREE from 'three';
import { box, std } from './shapes.ts';

export function makeTank(): THREE.Group {
  const group = new THREE.Group();
  const hull = 0x4f563f;
  const track = 0x2b2c28;
  group.add(box(1.7, 0.72, 3.1, hull, 0, 0.82, 0, 0.82, 0.28));
  group.add(box(2.05, 0.38, 3.15, track, 0, 0.42, 0, 0.9, 0.08));
  group.add(box(1.15, 0.55, 1.35, 0x454a3c, 0, 1.42, 0.1, 0.7, 0.35));
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 2.0, 8), std(0x2a2a28, 0.45, 0.65));
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 1.42, 1.45);
  barrel.castShadow = true;
  group.add(barrel);
  group.scale.setScalar(1.35);
  return group;
}
