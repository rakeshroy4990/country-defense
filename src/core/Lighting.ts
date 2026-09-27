import * as THREE from 'three';

export function addLighting(scene: THREE.Scene): void {
  const sky = new THREE.HemisphereLight(0xd6eeff, 0x8aaa5c, 1.05);
  scene.add(sky);

  const sun = new THREE.DirectionalLight(0xfff6dc, 1.55);
  sun.position.set(80, 110, 45);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 360;
  sun.shadow.camera.left = -160;
  sun.shadow.camera.right = 160;
  sun.shadow.camera.top = 110;
  sun.shadow.camera.bottom = -110;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  scene.add(sun);
  scene.add(sun.target);
}
