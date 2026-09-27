import * as THREE from 'three';
import { MAP_DEPTH, MAP_WIDTH, PATH_WIDTH } from '../data/constants.ts';
import { makeBorderGate, makeCapital } from '../models/landmarks.ts';
import { makeGrassTexture } from './grassTexture.ts';

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
    this.group.add(this.makeRoad());
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
    const mat = new THREE.MeshLambertMaterial({ map: makeGrassTexture() });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = 'ground';
    return mesh;
  }

  private makeRoad(): THREE.Mesh {
    const geo = new THREE.TubeGeometry(this.path, 100, this.pathWidth / 2, 10, false);
    const mat = new THREE.MeshLambertMaterial({ color: 0x8a6a3d });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    return mesh;
  }
}

function buildInvasionPath(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-96, 0.35, 0),
      new THREE.Vector3(-62, 0.35, 28),
      new THREE.Vector3(-22, 0.35, -22),
      new THREE.Vector3(18, 0.35, 26),
      new THREE.Vector3(58, 0.35, -18),
      new THREE.Vector3(96, 0.35, 0),
    ],
    false,
    'catmullrom',
    0.35,
  );
}

