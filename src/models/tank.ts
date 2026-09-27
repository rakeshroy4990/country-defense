import * as THREE from 'three';
import { box } from './shapes.ts';

export function makeTank(): THREE.Group {
  const group = new THREE.Group();
  group.add(box(2.3, 0.7, 1.35, 0x8a2b2b, 0, 0.7, 0));
  group.add(box(2.4, 0.28, 0.28, 0x3a1d1d, 0, 0.42, 0.7));
  group.add(box(2.4, 0.28, 0.28, 0x3a1d1d, 0, 0.42, -0.7));
  group.add(box(1.15, 0.5, 1.1, 0xb03a3a, 0.1, 1.25, 0));
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 1.6, 6),
    new THREE.MeshLambertMaterial({ color: 0x2c2c2c }),
  );
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(1.2, 1.28, 0);
  barrel.castShadow = true;
  group.add(barrel);
  return group;
}
