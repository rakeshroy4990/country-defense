export type TowerKind = 'cannon' | 'flak';

export interface TowerDef {
  kind: TowerKind;
  name: string;
  cost: number;
  range: number;
  damage: number;
  fireRateMs: number;
  color: number;
}

export const TOWER_DEFS: Record<TowerKind, TowerDef> = {
  cannon: {
    kind: 'cannon',
    name: 'Cannon',
    cost: 40,
    range: 22,
    damage: 8,
    fireRateMs: 900,
    color: 0x4a4e48,
  },
  flak: {
    kind: 'flak',
    name: 'Flak',
    cost: 70,
    range: 32,
    damage: 4,
    fireRateMs: 380,
    color: 0x3f4538,
  },
};

export const TOWER_KINDS = Object.keys(TOWER_DEFS) as TowerKind[];
