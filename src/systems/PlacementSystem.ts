import * as THREE from 'three';
import type { Terrain } from '../core/Terrain.ts';
import { TOWER_DEFS, type TowerKind } from '../data/towers.ts';
import { Tower } from '../entities/Tower.ts';
import { makePreviewMesh } from '../models/turret.ts';
import type { Economy } from './Economy.ts';
import { inMap, keyOf, snap } from './grid.ts';

export class PlacementSystem {
  selected: TowerKind = 'ak47';
  enabled = false;
  onSelectTower: ((tower: Tower | null) => void) | null = null;
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
    this.preview = makePreviewMesh();
    this.preview.visible = false;
    this.scene.add(this.preview);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointerup', this.onUp);
  }

  clearAll(): void {
    for (const tower of this.towers) tower.dispose();
    this.towers.length = 0;
    this.occupied.clear();
    this.preview.visible = false;
    this.onSelectTower?.(null);
  }

  private readonly onMove = (event: PointerEvent): void => {
    if (!this.enabled) {
      this.preview.visible = false;
      return;
    }
    const hit = this.hitGround(event);
    if (!hit) {
      this.preview.visible = false;
      return;
    }
    const x = snap(hit.x);
    const z = snap(hit.z);
    this.preview.position.set(x, 1.2, z);
    this.preview.visible = !this.occupied.has(keyOf(x, z));
    const mat = this.preview.material as THREE.MeshStandardMaterial;
    mat.color.setHex(this.canPlace(x, z) ? 0x5a6754 : 0x6a4038);
  };

  private readonly onDown = (event: PointerEvent): void => {
    if (event.button === 0) this.press = { x: event.clientX, y: event.clientY };
  };

  private readonly onUp = (event: PointerEvent): void => {
    if (event.button !== 0 || !this.press) {
      this.press = null;
      return;
    }
    const dragged = Math.hypot(event.clientX - this.press.x, event.clientY - this.press.y) > 6;
    this.press = null;
    if (!dragged && this.enabled) this.tryPlace(event);
  };

  private tryPlace(event: PointerEvent): void {
    const hit = this.hitGround(event);
    if (!hit) return;
    const x = snap(hit.x);
    const z = snap(hit.z);
    const existing = this.occupied.get(keyOf(x, z));
    if (existing) {
      this.onSelectTower?.(existing);
      return;
    }
    this.onSelectTower?.(null);
    const def = TOWER_DEFS[this.selected];
    if (!this.canPlace(x, z) || !this.economy.spend(def.cost)) return;
    const tower = new Tower(def, x, z, keyOf(x, z));
    this.scene.add(tower.mesh);
    this.towers.push(tower);
    this.occupied.set(tower.cellKey, tower);
  }

  private canPlace(x: number, z: number): boolean {
    if (!inMap(x, z) || this.occupied.has(keyOf(x, z)) || this.terrain.isOnPath(x, z, 2)) {
      return false;
    }
    return this.economy.canAfford(TOWER_DEFS[this.selected].cost);
  }

  private hitGround(event: PointerEvent): THREE.Vector3 | null {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObject(this.terrain.ground)[0]?.point ?? null;
  }
}
