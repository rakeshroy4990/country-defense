import * as THREE from 'three';
import type { TowerKind } from '../data/towers.ts';
import { box, cyl, std } from './shapes.ts';

export function makeWeapon(kind: TowerKind): THREE.Group {
  return kind === 'apache' ? makeApache() : makeAk47();
}

export function weaponMuzzle(kind: TowerKind): THREE.Vector3 {
  return kind === 'apache' ? new THREE.Vector3(0, 1.62, -2.35) : new THREE.Vector3(0, 1.3, -2.45);
}

export function spinWeapon(root: THREE.Object3D, delta: number): void {
  const rotors = root.getObjectByName('rotors');
  if (rotors) rotors.rotation.y += delta * 26;
}

function makeAk47(): THREE.Group {
  const g = new THREE.Group();
  g.add(box(1.7, 0.32, 1.5, 0x6b5a3a, 0, 0.16, 0.15, 0.92, 0.04));
  g.add(box(0.26, 0.2, 0.82, 0x5a4030, 0, 1.08, 0.58, 0.88, 0.05));
  g.add(box(0.3, 0.26, 0.68, 0x2a2c28, 0, 1.18, 0.08, 0.45, 0.55));
  const mag = box(0.15, 0.52, 0.26, 0x2f332c, 0, 0.86, 0.08, 0.5, 0.4);
  mag.rotation.z = 0.2;
  g.add(mag);
  g.add(box(0.22, 0.18, 0.68, 0x4a3a28, 0, 1.16, -0.52, 0.85, 0.08));
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.45, 8), std(0x2a2a28, 0.35, 0.7));
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 1.24, -1.48);
  barrel.castShadow = true;
  g.add(barrel);
  g.add(box(0.06, 0.16, 0.06, 0x2a2a28, 0, 1.38, -2.18, 0.4, 0.5));
  return g;
}

function makeApache(): THREE.Group {
  const g = new THREE.Group();
  g.add(box(1.2, 0.72, 3.5, 0x4a4a3a, 0, 2.2, 0.05, 0.7, 0.35));
  g.add(box(0.88, 0.46, 1.15, 0x2a3338, 0, 2.5, -1.2, 0.25, 0.55));
  g.add(box(0.3, 0.22, 2.3, 0x3f3f36, 0, 2.2, 2.25, 0.65, 0.4));
  g.add(box(0.08, 0.72, 0.55, 0x3a3a34, 0, 2.62, 3.3, 0.55, 0.4));
  g.add(box(2.5, 0.08, 0.4, 0x3d3d36, 0, 2.1, 0.12, 0.6, 0.35));
  g.add(box(0.22, 0.18, 0.72, 0x2c2c28, -1.1, 1.95, 0.12, 0.4, 0.5));
  g.add(box(0.22, 0.18, 0.72, 0x2c2c28, 1.1, 1.95, 0.12, 0.4, 0.5));
  g.add(box(0.12, 0.48, 0.12, 0x33332e, -0.38, 1.58, 0.45));
  g.add(box(0.12, 0.48, 0.12, 0x33332e, 0.38, 1.58, 0.45));
  g.add(box(1.15, 0.06, 0.12, 0x2a2a26, 0, 1.34, 0.45));
  const chin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.72, 8), std(0x2a2a28, 0.35, 0.7));
  chin.rotation.x = Math.PI / 2;
  chin.position.set(0, 1.72, -1.95);
  g.add(chin);
  const rotors = new THREE.Group();
  rotors.name = 'rotors';
  rotors.position.set(0, 2.68, 0.05);
  for (let i = 0; i < 4; i++) {
    const blade = box(0.16, 0.04, 3.7, 0x2c2c2a, 0, 0, 0, 0.55, 0.25);
    blade.rotation.y = (Math.PI / 2) * i;
    rotors.add(blade);
  }
  rotors.add(cyl(0.12, 0.16, 0.18, 0x33332e, 0, 8));
  g.add(rotors);
  return g;
}
