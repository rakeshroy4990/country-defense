import * as THREE from 'three';

export function addLighting(scene: THREE.Scene): void {
  const ambient = new THREE.AmbientLight(0xc8d6e5, 0.55);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff1c9, 1.35);
  sun.position.set(60, 90, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 280;
  sun.shadow.camera.left = -120;
  sun.shadow.camera.right = 120;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  scene.add(sun.target);
}
