import { STARTING_CAPITAL_HP, STARTING_CURRENCY } from '../data/constants.ts';
import type { TowerKind } from '../data/towers.ts';
import { CombatSystem } from '../systems/CombatSystem.ts';
import { Economy } from '../systems/Economy.ts';
import { PlacementSystem } from '../systems/PlacementSystem.ts';
import { WaveManager } from '../systems/WaveManager.ts';
import { HUD } from '../ui/HUD.ts';
import { addLighting } from './Lighting.ts';
import { GameScene } from './Scene.ts';
import { Terrain } from './Terrain.ts';

export class Game {
  private readonly scene: GameScene;
  private readonly terrain: Terrain;
  private readonly hud: HUD;
  private readonly economy: Economy;
  private readonly waves: WaveManager;
  private readonly placement: PlacementSystem;
  private readonly combat: CombatSystem;
  private capitalHp = STARTING_CAPITAL_HP;
  private last = performance.now();

  constructor(host: HTMLElement) {
    this.scene = new GameScene(host);
    this.terrain = new Terrain();
    this.scene.scene.add(this.terrain.group);
    addLighting(this.scene.scene);
    this.economy = new Economy(STARTING_CURRENCY);
    this.hud = new HUD(host, (kind) => this.selectTower(kind));
    this.waves = new WaveManager(this.scene.scene, this.terrain.path, this.terrain.pathLength, {
      onWaveStarted: (wave, total) => console.log(`Wave ${wave}/${total}`),
      onEnemyReachedCapital: () => this.leak(),
      onEnemyKilled: (enemy) => this.economy.earn(enemy.reward),
      onWaveCleared: (wave) => console.log(`Wave ${wave} cleared`),
      onAllWavesCleared: () => console.log('Victory'),
    });
    this.placement = new PlacementSystem(
      this.scene.camera,
      this.scene.renderer.domElement,
      this.terrain,
      this.scene.scene,
      this.economy,
    );
    this.combat = new CombatSystem(this.scene.scene, () => undefined);
    this.waves.start();
    requestAnimationFrame(this.tick);
  }

  private selectTower(kind: TowerKind): void {
    this.placement.selected = kind;
    this.hud.setSelected(kind);
  }

  private leak(): void {
    this.capitalHp = Math.max(0, this.capitalHp - 1);
    console.log(`Capital HP=${this.capitalHp}`);
  }

  private readonly tick = (now: number): void => {
    const delta = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.combat.update(delta, this.placement.towers, this.waves.enemies);
    this.waves.update(delta);
    this.hud.update(
      this.waves.currentWave,
      this.waves.totalWaves,
      this.capitalHp,
      this.waves.enemiesRemaining,
      this.economy.gold,
    );
    this.scene.render();
    requestAnimationFrame(this.tick);
  };
}
