import * as THREE from 'three';
import { MAP_DEPTH, MAP_WIDTH } from '../data/constants.ts';
import { std } from '../models/shapes.ts';

export function addSurroundings(scene: THREE.Scene): void {
  scene.add(makeSky());
  scene.add(makeCountryside());
  addHills(scene);
  addGrove(scene);
}

function makeSky(): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('sky');
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#7ec4ef');
  grad.addColorStop(0.45, '#c5e4f6');
  grad.addColorStop(0.72, '#e7f3dc');
  grad.addColorStop(1, '#d8e8c8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(480, 32, 20),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide }),
  );
  return mesh;
}

function makeCountryside(): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(560, 420),
    std(0x6f9a4e, 0.96, 0),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.08;
  mesh.receiveShadow = true;
  return mesh;
}

function addHills(scene: THREE.Scene): void {
  const spots = [
    [-170, 18, -90], [180, 22, -70], [150, 16, 95], [-160, 20, 80],
    [-40, 14, -130], [60, 18, 125], [210, 26, 20], [-210, 24, -10],
  ];
  for (const [x, h, z] of spots) {
    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(1, 14, 10),
      std(0x7aa35a, 0.97, 0),
    );
    hill.scale.set(28, h, 22);
    hill.position.set(x, h * 0.15, z);
    hill.receiveShadow = true;
    scene.add(hill);
  }
}

function addGrove(scene: THREE.Scene): void {
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2 + i * 0.17;
    const radius = 128 + (i % 5) * 14;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.72;
    if (Math.abs(x) < MAP_WIDTH / 2 + 8 && Math.abs(z) < MAP_DEPTH / 2 + 8) {
      continue;
    }
    scene.add(makeTree(x, z, 0.85 + (i % 4) * 0.15));
  }
}

function makeTree(x: number, z: number, scale: number): THREE.Group {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 2.1, 6), std(0x6b4a2e, 0.9, 0));
  trunk.position.y = 1.05;
  trunk.castShadow = true;
  const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.35, 8, 6), std(0x3f7a38, 0.88, 0));
  leaves.position.y = 2.6;
  leaves.castShadow = true;
  tree.add(trunk, leaves);
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);
  return tree;
}
