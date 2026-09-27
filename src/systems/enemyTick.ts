import type { Enemy } from '../entities/Enemy.ts';

export function tickEnemies(
  enemies: Enemy[],
  delta: number,
  onKill: (enemy: Enemy) => void,
  onLeak: (enemy: Enemy) => void,
): void {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (!enemy) continue;
    if (enemy.dying) {
      if (!enemy.rewarded) {
        enemy.rewarded = true;
        onKill(enemy);
      }
      if (enemy.updateDeath(delta)) {
        enemy.dispose();
        enemies.splice(i, 1);
      }
      continue;
    }
    enemy.update(delta);
    if (enemy.reachedCapital) {
      onLeak(enemy);
      enemy.dispose();
      enemies.splice(i, 1);
    }
  }
}
