import * as THREE from 'three';
import { MAP_DEPTH, MAP_WIDTH, PATH_WIDTH } from '../data/constants.ts';
import { makeBorderGate, makeCapital } from '../models/landmarks.ts';
import { makeGrassTexture } from './grassTexture.ts';
import { makeFlatRoad } from './road.ts';

export class Terrain {
  readonly group = new THREE.Group();
  readonly ground: THREE.Mesh;
  readonly path: THREE.CatmullRomCurve3;
  readonly pathWidth = PATH_WIDTH;
  readonly pathLength: number;

  constructor() {
    this.path = buildInvasionPath();
    this.pathLength = this.path.getLength();
    this.ground = this.makeGround();
    this.group.add(this.ground);
    this.group.add(makeFlatRoad(this.path, this.pathWidth));
    this.group.add(makeBorderGate(this.path.getPointAt(0)));
    this.group.add(makeCapital(this.path.getPointAt(1)));
  }

  isOnPath(x: number, z: number, extra = 1.5): boolean {
    const limit = this.pathWidth / 2 + extra;
    const samples = 80;
    for (let i = 0; i <= samples; i++) {
      const p = this.path.getPointAt(i / samples);
      if (Math.hypot(p.x - x, p.z - z) <= limit) {
        return true;
      }
    }
    return false;
  }

  private makeGround(): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(MAP_WIDTH, MAP_DEPTH);
    const mat = new THREE.MeshStandardMaterial({
      map: makeGrassTexture(),
      roughness: 0.95,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = 'ground';
    return mesh;
  }

}

function buildInvasionPath(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-96, 0.2, 0),
      new THREE.Vector3(-62, 0.2, 28),
      new THREE.Vector3(-22, 0.2, -22),
      new THREE.Vector3(18, 0.2, 26),
      new THREE.Vector3(58, 0.2, -18),
      new THREE.Vector3(96, 0.2, 0),
    ],
    false,
    'catmullrom',
    0.35,
  );
}

