import * as THREE from 'three';
import { MAP_DEPTH, MAP_WIDTH } from '../data/constants.ts';

export class GameScene {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;

  constructor(host: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb7d8f0);
    this.scene.fog = new THREE.Fog(0xd5e8f4, 260, 620);

    this.camera = new THREE.PerspectiveCamera(38, 1, 1, 900);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
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
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();

    const aim = new THREE.Vector3(0, 0, 0);
    const dir = new THREE.Vector3(0, 0.72, 0.7).normalize();
    const corners = mapCorners();
    let dist = 150;
    for (let step = 0; step < 18; step++) {
      this.camera.position.copy(dir).multiplyScalar(dist);
      this.camera.lookAt(aim);
      this.camera.updateMatrixWorld();
      if (allOnScreen(this.camera, corners)) break;
      dist += 8;
    }
  }

  private readonly onResize = (): void => {
    this.fitBaseToScreen();
  };
}

function mapCorners(): THREE.Vector3[] {
  const hw = MAP_WIDTH / 2;
  const hd = MAP_DEPTH / 2;
  return [
    new THREE.Vector3(-hw, 0, -hd),
    new THREE.Vector3(hw, 0, -hd),
    new THREE.Vector3(-hw, 0, hd),
    new THREE.Vector3(hw, 0, hd),
    new THREE.Vector3(-hw, 8, 0),
    new THREE.Vector3(hw, 8, 0),
  ];
}

function allOnScreen(camera: THREE.PerspectiveCamera, corners: THREE.Vector3[]): boolean {
  const ndc = new THREE.Vector3();
  for (const corner of corners) {
    ndc.copy(corner).project(camera);
    if (Math.abs(ndc.x) > 0.66 || Math.abs(ndc.y) > 0.58 || ndc.z > 1) {
      return false;
    }
  }
  return true;
}
