import * as THREE from 'three';
import { box, cyl } from './shapes.ts';

export function makeBorderGate(at: THREE.Vector3): THREE.Group {
  const group = new THREE.Group();
  const concrete = 0x6a6860;
  group.add(box(1.6, 7.2, 1.6, concrete, -3.4, 3.6, 0, 0.9, 0.05));
  group.add(box(1.6, 7.2, 1.6, concrete, 3.4, 3.6, 0, 0.9, 0.05));
  group.add(box(8.6, 1.1, 1.8, 0x5c5a54, 0, 7.5, 0, 0.85, 0.08));
  group.add(box(0.2, 4.8, 2.4, 0x3a3a38, 0, 2.6, 0, 0.5, 0.4));
  group.position.set(at.x, 0, at.z);
  return group;
}

export function makeCapital(at: THREE.Vector3): THREE.Group {
  const group = new THREE.Group();
  group.add(box(8.2, 3.6, 7.4, 0x7a776e, 0, 1.8, 0, 0.88, 0.04));
  group.add(box(5.4, 3.0, 5.2, 0x6e6b64, 0, 5.1, 0, 0.86, 0.05));
  group.add(box(6.2, 0.35, 6.0, 0x4d4c48, 0, 6.7, 0, 0.7, 0.15));
  group.add(cyl(0.16, 0.16, 2.4, 0x3f3f3c, 8.0, 8));
  group.position.set(at.x, 0, at.z);
  return group;
}
