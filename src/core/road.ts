import * as THREE from 'three';
import { makeAsphaltTexture } from './grassTexture.ts';

export function makeFlatRoad(path: THREE.CatmullRomCurve3, width: number): THREE.Mesh {
  const segments = 80;
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  const side = new THREE.Vector3();

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = path.getPointAt(t);
    const tan = path.getTangentAt(t);
    side.set(-tan.z, 0, tan.x).normalize().multiplyScalar(width / 2);
    positions.push(point.x + side.x, 0.03, point.z + side.z);
    positions.push(point.x - side.x, 0.03, point.z - side.z);
    uvs.push(0, t * 12, 1, t * 12);
    if (i === 0) continue;
    const a = (i - 1) * 2;
    const c = i * 2;
    index.push(a, a + 1, c, a + 1, c + 1, c);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      map: makeAsphaltTexture(),
      roughness: 0.96,
      metalness: 0,
    }),
  );
  mesh.receiveShadow = true;
  return mesh;
}
