export const subStats = [
  "CritDmg",
  "CritRate",
  "ATK%",
  "HP%",
  "DEF%",
  "EffectiveDMG",
  "IneffectiveDMG",
  "EnergyRegen",
  "HP",
  "DEF",
  "ATK",
] as const;
export type SubStat = (typeof subStats)[number];

export const spentExps = [4400, 16500, 39600, 79100, 142600].map(
  (exp, i, arr) => (i == 0 ? exp : exp - arr[i - 1])
);

export const firstClasses: SubStat[] = ["CritDmg", "CritRate"];
export const secondClasses: SubStat[] = [
  "ATK%",
  "EffectiveDMG",
  "EnergyRegen",
  "ATK",
];
export const ineffectiveClasses: SubStat[] = subStats.filter(
  (v) => !firstClasses.includes(v) && !secondClasses.includes(v)
);
