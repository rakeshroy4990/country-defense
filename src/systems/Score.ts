const KEY = 'country-defense-best';

export interface BestScore {
  hpLost: number;
  seconds: number;
}

export function loadBest(): BestScore | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as BestScore;
    if (typeof parsed.hpLost !== 'number' || typeof parsed.seconds !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function recordBest(hpLost: number, seconds: number): BestScore {
  const next: BestScore = { hpLost, seconds };
  const prev = loadBest();
  const better =
    !prev ||
    hpLost < prev.hpLost ||
    (hpLost === prev.hpLost && seconds < prev.seconds);
  if (better) {
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }
  return prev;
}

export function formatBest(best: BestScore | null): string {
  if (!best) {
    return 'Best: —';
  }
  return `Best: ${best.hpLost} HP lost · ${best.seconds.toFixed(1)}s`;
}
