import * as THREE from 'three';
import { MAP_DEPTH, MAP_WIDTH } from '../data/constants.ts';

export class GameScene {
  readonly scene: THREE.Scene;
  readonly camera: THREE.OrthographicCamera;
  readonly renderer: THREE.WebGLRenderer;

  constructor(host: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x6d7d86);
    this.scene.fog = new THREE.Fog(0x6d7d86, 160, 340);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 500);
    this.camera.position.set(0, 92, 48);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(this.renderer.domElement);

    this.fitBaseToScreen();
    window.addEventListener('resize', this.onResize);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private fitBaseToScreen(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.updateMatrixWorld();
    const inv = this.camera.matrixWorldInverse;
    const hw = MAP_WIDTH / 2;
    const hd = MAP_DEPTH / 2;
    const corners = [
      new THREE.Vector3(-hw, 0, -hd),
      new THREE.Vector3(hw, 0, -hd),
      new THREE.Vector3(-hw, 0, hd),
      new THREE.Vector3(hw, 0, hd),
      new THREE.Vector3(0, 8, 0),
    ];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const corner of corners) {
      const v = corner.applyMatrix4(inv);
      minX = Math.min(minX, v.x);
      maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y);
      maxY = Math.max(maxY, v.y);
    }
    const pad = 3;
    const mapW = maxX - minX + pad * 2;
    const mapH = maxY - minY + pad * 2;
    const aspect = width / Math.max(height, 1);
    let viewW = mapW;
    let viewH = mapH;
    if (aspect > mapW / mapH) viewW = viewH * aspect;
    else viewH = viewW / aspect;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    this.camera.left = cx - viewW / 2;
    this.camera.right = cx + viewW / 2;
    this.camera.top = cy + viewH / 2;
    this.camera.bottom = cy - viewH / 2;
    this.camera.updateProjectionMatrix();
  }

  private readonly onResize = (): void => {
    this.fitBaseToScreen();
  };
}
