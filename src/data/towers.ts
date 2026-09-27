export type TowerKind = 'ak47' | 'apache';

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
  ak47: {
    kind: 'ak47',
    name: 'AK-47',
    cost: 40,
    range: 22,
    damage: 8,
    fireRateMs: 280,
    color: 0x3f4638,
  },
  apache: {
    kind: 'apache',
    name: 'Apache Helicopter',
    cost: 90,
    range: 38,
    damage: 12,
    fireRateMs: 520,
    color: 0x4a4a3a,
  },
};

export const TOWER_KINDS = Object.keys(TOWER_DEFS) as TowerKind[];
