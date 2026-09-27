import * as THREE from 'three';
import { box, cyl } from './shapes.ts';

export function makeTurret(color: number): THREE.Group {
  const group = new THREE.Group();
  group.add(cyl(1.7, 1.9, 0.55, 0x3d4a40, 0.28, 8));
  group.add(cyl(1.2, 1.35, 1.4, color, 1.15, 8));
  group.add(cyl(0.7, 0.85, 0.7, 0xd8c37a, 2.15, 8));
  const gun = box(1.8, 0.28, 0.28, 0x2a2a2a, 1.15, 2.15, 0);
  group.add(gun);
  return group;
}

export function makePreviewMesh(): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.8, 2.4, 8),
    new THREE.MeshLambertMaterial({ color: 0x88ff88, transparent: true, opacity: 0.4 }),
  );
}
