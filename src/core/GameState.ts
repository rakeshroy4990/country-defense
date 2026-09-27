export const Phase = {
  Menu: 'menu',
  Playing: 'playing',
  Paused: 'paused',
  GameOver: 'gameover',
  Victory: 'victory',
} as const;

export type Phase = (typeof Phase)[keyof typeof Phase];

export class GameState {
  phase: Phase = Phase.Menu;

  get playing(): boolean {
    return this.phase === Phase.Playing;
  }

  set(next: Phase): void {
    this.phase = next;
  }
}
