import * as THREE from 'three';
import { box, cyl } from './shapes.ts';

export function makeBorderGate(at: THREE.Vector3): THREE.Group {
  const group = new THREE.Group();
  group.add(box(1.4, 8, 1.4, 0x5a3a24, -3.2, 4, 0));
  group.add(box(1.4, 8, 1.4, 0x5a3a24, 3.2, 4, 0));
  group.add(box(8.2, 1.3, 1.5, 0x6b4528, 0, 8.2, 0));
  group.add(box(0.3, 5.5, 2.2, 0x3a2a18, 0, 3.2, 0));
  group.position.set(at.x, 0, at.z);
  return group;
}

export function makeCapital(at: THREE.Vector3): THREE.Group {
  const group = new THREE.Group();
  group.add(box(7, 4.2, 7, 0xcbb56a, 0, 2.1, 0));
  group.add(box(4.2, 3.4, 4.2, 0xe0cc7a, 0, 5.8, 0));
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 3.4, 5),
    new THREE.MeshLambertMaterial({ color: 0xb33a3a }),
  );
  roof.position.y = 9;
  roof.castShadow = true;
  group.add(roof);
  group.add(cyl(0.18, 0.18, 2.2, 0xf2e6a0, 10.8, 6));
  group.position.set(at.x, 0, at.z);
  return group;
}
