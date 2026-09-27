import * as THREE from 'three';
import { box, cyl, std } from './shapes.ts';

export function makeTurret(color: number): THREE.Group {
  const group = new THREE.Group();
  group.add(cyl(1.85, 2.05, 0.45, 0x4a4a44, 0.24, 10));
  group.add(cyl(1.15, 1.3, 1.25, color, 1.05, 10));
  group.add(cyl(0.62, 0.78, 0.55, 0x3d3d38, 1.9, 10));
  group.add(box(1.9, 0.2, 0.2, 0x2c2c2a, 1.2, 1.9, 0, 0.4, 0.7));
  return group;
}

export function makePreviewMesh(): THREE.Mesh {
  const mat = std(0x6a6a62, 0.9, 0.05);
  mat.transparent = true;
  mat.opacity = 0.32;
  return new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 1.8, 12), mat);
}
