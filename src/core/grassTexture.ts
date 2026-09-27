import * as THREE from 'three';

export function makeGrassTexture(): THREE.CanvasTexture {
  return canvasTexture(512, (ctx, size) => {
    ctx.fillStyle = '#3a4f2e';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 9000; i++) {
      const g = 48 + Math.floor(Math.random() * 46);
      const r = g - 18 - Math.floor(Math.random() * 10);
      ctx.fillStyle = `rgb(${r},${g},${r - 6})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 2 + Math.random() * 3, 2);
    }
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `rgba(90, 78, 48, ${0.08 + Math.random() * 0.12})`;
      ctx.beginPath();
      ctx.ellipse(Math.random() * size, Math.random() * size, 8 + Math.random() * 18, 5 + Math.random() * 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 16, 8);
}

export function makeAsphaltTexture(): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#3c3c3a';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 4000; i++) {
      const n = 48 + Math.floor(Math.random() * 36);
      ctx.fillStyle = `rgb(${n},${n},${n - 2})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }
    ctx.strokeStyle = 'rgba(210, 190, 120, 0.22)';
    ctx.setLineDash([10, 14]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();
  }, 18, 1);
}

function canvasTexture(
  size: number,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
  repeatX: number,
  repeatY: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create terrain texture');
  paint(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
