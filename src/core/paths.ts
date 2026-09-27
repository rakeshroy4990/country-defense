import * as THREE from 'three';

export interface InvasionRoute {
  curve: THREE.CatmullRomCurve3;
  length: number;
}

const CAPITAL = new THREE.Vector3(96, 0.2, 0);

export function buildInvasionRoutes(): InvasionRoute[] {
  return [
    points(-96, 36, -58, 42, -12, 34, 38, 24, 72, 12),
    points(-96, 0, -52, -18, 8, 16, 48, -14, 74, 6),
    points(-96, -36, -58, -42, -12, -30, 38, -26, 72, -10),
  ].map(toRoute);
}

export function pointOnAnyRoute(
  routes: readonly InvasionRoute[],
  x: number,
  z: number,
  limit: number,
): boolean {
  for (const route of routes) {
    for (let i = 0; i <= 80; i++) {
      const p = route.curve.getPointAt(i / 80);
      if (Math.hypot(p.x - x, p.z - z) <= limit) return true;
    }
  }
  return false;
}

function points(
  x0: number, z0: number,
  x1: number, z1: number,
  x2: number, z2: number,
  x3: number, z3: number,
  x4: number, z4: number,
): THREE.Vector3[] {
  return [
    new THREE.Vector3(x0, 0.2, z0),
    new THREE.Vector3(x1, 0.2, z1),
    new THREE.Vector3(x2, 0.2, z2),
    new THREE.Vector3(x3, 0.2, z3),
    new THREE.Vector3(x4, 0.2, z4),
    CAPITAL.clone(),
  ];
}

function toRoute(list: THREE.Vector3[]): InvasionRoute {
  const curve = new THREE.CatmullRomCurve3(list, false, 'catmullrom', 0.42);
  return { curve, length: curve.getLength() };
}
