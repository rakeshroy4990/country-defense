import * as THREE from 'three';

export function addLighting(scene: THREE.Scene): void {
  const sky = new THREE.HemisphereLight(0x8ea6b8, 0x3d3a2e, 0.62);
  scene.add(sky);

  const sun = new THREE.DirectionalLight(0xf2e6c8, 1.15);
  sun.position.set(70, 95, 35);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 280;
  sun.shadow.camera.left = -120;
  sun.shadow.camera.right = 120;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  scene.add(sun);
  scene.add(sun.target);
}
