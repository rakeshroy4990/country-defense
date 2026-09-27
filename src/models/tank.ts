import * as THREE from 'three';
import { box } from './shapes.ts';

export function makeTank(): THREE.Group {
  const group = new THREE.Group();
  group.add(box(1.8, 0.85, 3.2, 0xff2d2d, 0, 0.85, 0));
  group.add(box(2.1, 0.35, 3.3, 0x4a1010, 0, 0.45, 0));
  group.add(box(1.3, 0.7, 1.5, 0xff6a4a, 0, 1.55, 0.15));
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.2, 2.2, 8),
    new THREE.MeshLambertMaterial({ color: 0x222222, emissive: 0x111111 }),
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 1.55, 1.6);
  barrel.castShadow = true;
  group.add(barrel);
  const marker = new THREE.Mesh(
    new THREE.CircleGeometry(1.6, 16),
    new THREE.MeshBasicMaterial({ color: 0xffee55, transparent: true, opacity: 0.45 }),
  );
  marker.rotation.x = -Math.PI / 2;
  marker.position.y = 0.08;
  group.add(marker);
  group.scale.setScalar(1.6);
  return group;
}
