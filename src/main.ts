import './style.css';
import { GameScene } from './core/Scene.ts';
import { Terrain } from './core/Terrain.ts';
import { addLighting } from './core/Lighting.ts';
import { STARTING_CAPITAL_HP } from './data/constants.ts';
import { WaveManager } from './systems/WaveManager.ts';
import { HUD } from './ui/HUD.ts';

const host = document.querySelector<HTMLDivElement>('#app');
if (!host) {
  throw new Error('#app is missing');
}

const game = new GameScene(host);
const terrain = new Terrain();
game.scene.add(terrain.group);
addLighting(game.scene);

let capitalHp = STARTING_CAPITAL_HP;
const hud = new HUD(host);

const waves = new WaveManager(game.scene, terrain.path, terrain.pathLength, {
  onWaveStarted: (wave, total) => {
    console.log(`Wave ${wave}/${total} started`);
  },
  onEnemyReachedCapital: () => {
    capitalHp = Math.max(0, capitalHp - 1);
    console.log(`Enemy reached capital. HP=${capitalHp}`);
  },
  onWaveCleared: (wave) => {
    console.log(`Wave ${wave} cleared`);
  },
  onAllWavesCleared: () => {
    console.log('All waves cleared');
  },
});
waves.start();

let last = performance.now();

function tick(now: number): void {
  const delta = Math.min(0.05, (now - last) / 1000);
  last = now;
  waves.update(delta);
  hud.update(waves.currentWave, waves.totalWaves, capitalHp, waves.enemiesRemaining);
  game.render();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
