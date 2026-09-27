import { Sound } from '../audio/Sound.ts';
import { STARTING_CAPITAL_HP, STARTING_CURRENCY } from '../data/constants.ts';
import type { Enemy } from '../entities/Enemy.ts';
import type { Tower } from '../entities/Tower.ts';
import type { TowerKind } from '../data/towers.ts';
import { FxSystem } from '../fx/FxSystem.ts';
import { CombatSystem } from '../systems/CombatSystem.ts';
import { Economy } from '../systems/Economy.ts';
import { KingdomLog } from '../systems/KingdomLog.ts';
import { PlacementSystem } from '../systems/PlacementSystem.ts';
import { formatBest, recordBest } from '../systems/Score.ts';
import { WaveManager } from '../systems/WaveManager.ts';
import { HUD } from '../ui/HUD.ts';
import { Screens } from '../ui/Screens.ts';
import { bindPause } from './bindPause.ts';
import { addLighting } from './Lighting.ts';
import { GameScene } from './Scene.ts';
import { addSurroundings } from './Surroundings.ts';
import { GameState, Phase } from './GameState.ts';
import { Terrain } from './Terrain.ts';

export class Game {
  private readonly scene: GameScene;
  private readonly hud: HUD;
  private readonly screens: Screens;
  private readonly economy: Economy;
  private readonly waves: WaveManager;
  private readonly placement: PlacementSystem;
  private readonly combat: CombatSystem;
  private readonly fx: FxSystem;
  private readonly sound = new Sound();
  private readonly kingdom = new KingdomLog();
  private readonly state = new GameState();
  private capitalHp = STARTING_CAPITAL_HP;
  private startedAt = 0;
  private last = performance.now();

  constructor(host: HTMLElement) {
    this.scene = new GameScene(host);
    const terrain = new Terrain();
    this.scene.scene.add(terrain.group);
    addSurroundings(this.scene.scene);
    addLighting(this.scene.scene);
    this.economy = new Economy(STARTING_CURRENCY);
    this.hud = new HUD(host, (kind) => this.selectTower(kind), (t) => this.upgrade(t));
    this.screens = new Screens(host, {
      onStart: () => this.beginMatch(),
      onRestart: () => this.beginMatch(),
      onResume: () => this.togglePause(),
    });
    this.fx = new FxSystem(this.scene.scene);
    this.waves = new WaveManager(this.scene.scene, terrain.path, terrain.pathLength, {
      onLevelStarted: () => undefined,
      onWaveStarted: () => undefined,
      onEnemyReachedCapital: (enemy) => this.leak(enemy),
      onEnemyKilled: (enemy) => this.rewardKill(enemy),
      onAllWavesCleared: () => this.win(),
    });
    this.placement = new PlacementSystem(
      this.scene.camera, this.scene.renderer.domElement, terrain, this.scene.scene, this.economy,
    );
    this.placement.onSelectTower = (tower) => this.hud.setFocused(tower);
    this.combat = new CombatSystem(
      this.scene.scene,
      terrain.path.getPointAt(1).setY(4.2),
      () => this.sound.shoot(),
      (at) => this.fx.spawn(at, 0x4a4538),
    );
    bindPause(() => this.togglePause());
    host.addEventListener('pointerdown', () => this.sound.unlock(), { once: true });
    this.beginMatch();
    requestAnimationFrame(this.tick);
  }

  private selectTower(kind: TowerKind): void {
    this.placement.selected = kind;
    this.hud.setSelected(kind);
  }

  private upgrade(tower: Tower): void {
    if (this.economy.spend(tower.upgradeCost())) tower.upgrade();
    this.hud.setFocused(tower);
  }

  private rewardKill(enemy: Enemy): void {
    this.economy.earn(enemy.reward);
    this.sound.death();
    this.fx.spawn(enemy.mesh.position, 0x5a4e3a);
  }

  private beginMatch(): void {
    this.sound.unlock();
    this.combat.clearAll();
    this.placement.clearAll();
    this.fx.clearAll();
    this.economy.reset(STARTING_CURRENCY);
    this.kingdom.clear();
    this.capitalHp = STARTING_CAPITAL_HP;
    this.hud.setDamageLog(0, 0, []);
    this.startedAt = performance.now();
    this.state.set(Phase.Playing);
    this.placement.enabled = true;
    this.hud.setVisible(true);
    this.screens.hideAll();
    this.waves.start();
  }

  private leak(enemy: Enemy): void {
    this.capitalHp = Math.max(0, this.capitalHp - enemy.kingdomDamage);
    this.kingdom.record(enemy.name, enemy.kingdomDamage, this.capitalHp);
    this.hud.setDamageLog(this.kingdom.hits.length, this.kingdom.totalDamage, this.kingdom.recent());
    this.sound.leak();
    if (this.capitalHp <= 0) {
      this.finish(Phase.GameOver, `${enemy.name} breached the kingdom. ${this.kingdom.totalDamage} damage recorded.`, 'Game Over');
    }
  }

  private win(): void {
    const seconds = (performance.now() - this.startedAt) / 1000;
    const best = recordBest(STARTING_CAPITAL_HP - this.capitalHp, seconds);
    this.finish(Phase.Victory, `${formatBest(best)} · kingdom took ${this.kingdom.totalDamage} damage in ${seconds.toFixed(1)}s`, 'Victory');
  }

  private finish(phase: Phase, body: string, title: string): void {
    this.waves.stop();
    this.placement.enabled = false;
    this.state.set(phase);
    this.screens.showResult(title, body);
  }

  private togglePause(): void {
    if (this.state.playing) {
      this.state.set(Phase.Paused);
      this.placement.enabled = false;
      this.screens.showPause();
      return;
    }
    if (this.state.phase !== Phase.Paused) return;
    this.state.set(Phase.Playing);
    this.placement.enabled = true;
    this.screens.hideAll();
  }

  private readonly tick = (now: number): void => {
    const delta = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    if (this.state.playing) {
      this.combat.update(delta, this.placement.towers, this.waves.enemies);
      this.waves.update(delta);
    }
    this.fx.update(delta);
    const w = this.waves;
    this.hud.update(w.currentLevel, w.totalLevels, w.levelName, w.incomingName, this.capitalHp, w.enemiesRemaining, this.economy.gold, w.waveProgress);
    this.scene.render();
    requestAnimationFrame(this.tick);
  };
}
