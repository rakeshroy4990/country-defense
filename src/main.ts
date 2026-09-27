import './style.css';
import { GameScene } from './core/Scene.ts';
import { Terrain } from './core/Terrain.ts';
import { addLighting } from './core/Lighting.ts';

const host = document.querySelector<HTMLDivElement>('#app');
if (!host) {
  throw new Error('#app is missing');
}

const game = new GameScene(host);
const terrain = new Terrain();
game.scene.add(terrain.group);
addLighting(game.scene);

function tick(): void {
  game.render();
  requestAnimationFrame(tick);
}

tick();
