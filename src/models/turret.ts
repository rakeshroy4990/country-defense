import * as THREE from 'three';
import { std } from './shapes.ts';

export function makePreviewMesh(): THREE.Mesh {
  const mat = std(0x6a6a62, 0.9, 0.05);
  mat.transparent = true;
  mat.opacity = 0.32;
  return new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 1.8, 12), mat);
}
