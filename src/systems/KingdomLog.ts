export interface DamageRecord {
  attacker: string;
  damage: number;
  hpLeft: number;
  atMs: number;
}

export class KingdomLog {
  readonly hits: DamageRecord[] = [];
  totalDamage = 0;

  record(attacker: string, damage: number, hpLeft: number): DamageRecord {
    const row: DamageRecord = { attacker, damage, hpLeft, atMs: performance.now() };
    this.hits.push(row);
    this.totalDamage += damage;
    return row;
  }

  recent(limit = 6): DamageRecord[] {
    return this.hits.slice(-limit).reverse();
  }

  clear(): void {
    this.hits.length = 0;
    this.totalDamage = 0;
  }
}
