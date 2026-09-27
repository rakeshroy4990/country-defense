import * as THREE from 'three';
import { GRID_SIZE, MAP_DEPTH, MAP_WIDTH } from '../data/constants.ts';
import { TOWER_DEFS, type TowerKind } from '../data/towers.ts';
import { Tower } from '../entities/Tower.ts';
import type { Terrain } from '../core/Terrain.ts';
import type { Economy } from './Economy.ts';

export class PlacementSystem {
  selected: TowerKind = 'cannon';
  readonly towers: Tower[] = [];
  private readonly occupied = new Map<string, Tower>();
  private readonly preview: THREE.Mesh;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly camera: THREE.Camera;
  private readonly terrain: Terrain;
  private readonly scene: THREE.Scene;
  private readonly economy: Economy;
  private readonly canvas: HTMLElement;
  private press: { x: number; y: number } | null = null;

  constructor(
    camera: THREE.Camera,
    canvas: HTMLElement,
    terrain: Terrain,
    scene: THREE.Scene,
    economy: Economy,
  ) {
    this.camera = camera;
    this.canvas = canvas;
    this.terrain = terrain;
    this.scene = scene;
    this.economy = economy;
    this.preview = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 2.4, 8),
      new THREE.MeshLambertMaterial({ color: 0x88ff88, transparent: true, opacity: 0.4 }),
    );
    this.preview.visible = false;
    this.scene.add(this.preview);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointerup', this.onUp);
  }

  towerAt(x: number, z: number): Tower | undefined {
    return this.occupied.get(keyOf(snap(x), snap(z)));
  }

  clearAll(): void {
    for (const tower of this.towers) {
      tower.dispose();
    }
    this.towers.length = 0;
    this.occupied.clear();
    this.preview.visible = false;
  }

  dispose(): void {
    this.clearAll();
    this.preview.removeFromParent();
    this.canvas.removeEventListener('pointermove', this.onMove);
    this.canvas.removeEventListener('pointerdown', this.onDown);
    this.canvas.removeEventListener('pointerup', this.onUp);
  }

  private readonly onMove = (event: PointerEvent): void => {
    const hit = this.hitGround(event);
    if (!hit) {
      this.preview.visible = false;
      return;
    }
    const x = snap(hit.x);
    const z = snap(hit.z);
    this.preview.position.set(x, 1.2, z);
    this.preview.visible = true;
    const ok = this.canPlace(x, z);
    const mat = this.preview.material as THREE.MeshLambertMaterial;
    mat.color.setHex(ok ? 0x7dce8a : 0xe07060);
  };

  private readonly onDown = (event: PointerEvent): void => {
    if (event.button !== 0) {
      return;
    }
    this.press = { x: event.clientX, y: event.clientY };
  };

  private readonly onUp = (event: PointerEvent): void => {
    if (event.button !== 0 || !this.press) {
      this.press = null;
      return;
    }
    const dragged = Math.hypot(event.clientX - this.press.x, event.clientY - this.press.y) > 6;
    this.press = null;
    if (dragged) {
      return;
    }
    this.tryPlace(event);
  };

  private tryPlace(event: PointerEvent): void {
    const hit = this.hitGround(event);
    if (!hit) {
      return;
    }
    const x = snap(hit.x);
    const z = snap(hit.z);
    const def = TOWER_DEFS[this.selected];
    if (!this.canPlace(x, z) || !this.economy.spend(def.cost)) {
      return;
    }
    const tower = new Tower(def, x, z, keyOf(x, z));
    this.scene.add(tower.mesh);
    this.towers.push(tower);
    this.occupied.set(tower.cellKey, tower);
  }

  private canPlace(x: number, z: number): boolean {
    const halfW = MAP_WIDTH / 2 - GRID_SIZE;
    const halfD = MAP_DEPTH / 2 - GRID_SIZE;
    if (Math.abs(x) > halfW || Math.abs(z) > halfD) {
      return false;
    }
    if (this.occupied.has(keyOf(x, z)) || this.terrain.isOnPath(x, z, 2)) {
      return false;
    }
    return this.economy.canAfford(TOWER_DEFS[this.selected].cost);
  }

  private hitGround(event: PointerEvent): THREE.Vector3 | null {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObject(this.terrain.ground);
    return hits[0]?.point ?? null;
  }
}

function snap(v: number): number {
  return Math.round(v / GRID_SIZE) * GRID_SIZE;
}

function keyOf(x: number, z: number): string {
  return `${x}:${z}`;
}
