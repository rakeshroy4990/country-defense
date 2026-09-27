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
    speed: 10,
    kingdomDamage: 1,
    reward: 10,
    color: 0x6b6e72,
    scale: 1.55,
  },
  barricade: {
    id: 'barricade',
    name: 'Barricade',
    hp: 14,
    speed: 8,
    kingdomDamage: 2,
    reward: 14,
    color: 0x1f3a68,
    scale: 1.75,
  },
  bonecrusher: {
    id: 'bonecrusher',
    name: 'Bonecrusher',
    hp: 22,
    speed: 5.5,
    kingdomDamage: 3,
    reward: 18,
    color: 0x6a5a28,
    scale: 2.05,
  },
  shockwave: {
    id: 'shockwave',
    name: 'Shockwave',
    hp: 28,
    speed: 7,
    kingdomDamage: 3,
    reward: 22,
    color: 0x3d2458,
    scale: 1.95,
  },
  megatron: {
    id: 'megatron',
    name: 'Megatron',
    hp: 40,
    speed: 6.5,
    kingdomDamage: 5,
    reward: 36,
    color: 0x4a4e52,
    scale: 2.45,
  },
};

export function attackerById(id: string): AttackerDef {
  const def = ATTACKERS[id];
  if (!def) {
    throw new Error(`Unknown attacker ${id}`);
  }
  return def;
}
