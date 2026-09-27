import * as THREE from 'three';

export function makeGrassTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create grass texture');
  }

  ctx.fillStyle = '#4d7a3a';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 400; i++) {
    const shade = 55 + Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgb(${shade},${shade + 40},${shade})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 3, 3);
  }

  ctx.strokeStyle = 'rgba(28, 48, 18, 0.32)';
  ctx.lineWidth = 1;
  const step = 16;
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i + 0.5, 0);
    ctx.lineTo(i + 0.5, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i + 0.5);
    ctx.lineTo(size, i + 0.5);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 10);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
