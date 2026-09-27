import * as THREE from 'three';
import { MAP_DEPTH, MAP_WIDTH, PATH_WIDTH } from '../data/constants.ts';
import { makeBorderGate, makeCapital } from '../models/landmarks.ts';
import { makeGrassTexture } from './grassTexture.ts';
import { buildInvasionRoutes, pointOnAnyRoute, type InvasionRoute } from './paths.ts';
import { makeFlatRoad } from './road.ts';

export class Terrain {
  readonly group = new THREE.Group();
  readonly ground: THREE.Mesh;
  readonly routes: InvasionRoute[];
  readonly path: THREE.CatmullRomCurve3;
  readonly pathWidth = PATH_WIDTH;
  readonly pathLength: number;
  readonly capital: THREE.Vector3;

  constructor() {
    this.routes = buildInvasionRoutes();
    const home = this.routes[1] ?? this.routes[0];
    if (!home) throw new Error('Missing invasion routes');
    this.path = home.curve;
    this.pathLength = home.length;
    this.capital = home.curve.getPointAt(1);
    this.ground = this.makeGround();
    this.group.add(this.ground);
    for (const route of this.routes) {
      this.group.add(makeFlatRoad(route.curve, this.pathWidth));
      this.group.add(makeBorderGate(route.curve.getPointAt(0)));
    }
    this.group.add(makeCapital(this.capital));
  }

  isOnPath(x: number, z: number, extra = 1.5): boolean {
    return pointOnAnyRoute(this.routes, x, z, this.pathWidth / 2 + extra);
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
