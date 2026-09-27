export interface AttackerDef {
  id: string;
  name: string;
  hp: number;
  speed: number;
  kingdomDamage: number;
  reward: number;
  color: number;
  scale: number;
}

export const ATTACKERS: Record<string, AttackerDef> = {
  starscream: {
    id: 'starscream',
    name: 'Starscream',
    hp: 8,
    speed: 16,
    kingdomDamage: 1,
    reward: 10,
    color: 0x6b6e72,
    scale: 1.15,
  },
  barricade: {
    id: 'barricade',
    name: 'Barricade',
    hp: 14,
    speed: 12,
    kingdomDamage: 2,
    reward: 14,
    color: 0x1f3a68,
    scale: 1.3,
  },
  bonecrusher: {
    id: 'bonecrusher',
    name: 'Bonecrusher',
    hp: 22,
    speed: 8,
    kingdomDamage: 3,
    reward: 18,
    color: 0x6a5a28,
    scale: 1.55,
  },
  shockwave: {
    id: 'shockwave',
    name: 'Shockwave',
    hp: 28,
    speed: 10,
    kingdomDamage: 3,
    reward: 22,
    color: 0x3d2458,
    scale: 1.45,
  },
  megatron: {
    id: 'megatron',
    name: 'Megatron',
    hp: 40,
    speed: 9,
    kingdomDamage: 5,
    reward: 36,
    color: 0x4a4e52,
    scale: 1.85,
  },
};

export function attackerById(id: string): AttackerDef {
  const def = ATTACKERS[id];
  if (!def) {
    throw new Error(`Unknown attacker ${id}`);
  }
  return def;
}
