import * as THREE from 'three';
import { MAP_DEPTH, MAP_WIDTH } from '../data/constants.ts';

export class GameScene {
  readonly scene: THREE.Scene;
  readonly camera: THREE.OrthographicCamera;
  readonly renderer: THREE.WebGLRenderer;

  constructor(host: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x6f8aa0);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
    this.camera.position.set(0, 130, 0.01);
    this.camera.up.set(0, 0, -1);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
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
    const aspect = width / Math.max(height, 1);
    const mapAspect = MAP_WIDTH / MAP_DEPTH;
    let viewW = MAP_WIDTH;
    let viewH = MAP_DEPTH;
    if (aspect > mapAspect) {
      viewW = viewH * aspect;
    } else {
      viewH = viewW / aspect;
    }
    this.camera.left = -viewW / 2;
    this.camera.right = viewW / 2;
    this.camera.top = viewH / 2;
    this.camera.bottom = -viewH / 2;
    this.camera.updateProjectionMatrix();
  }

  private readonly onResize = (): void => {
    this.fitBaseToScreen();
  };
}
