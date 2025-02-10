import { SubStat } from "./constants.ts";

export const randomPick = (num: number) => Math.floor(Math.random() * num);

type CheckFunction = (subStats: SubStat[]) => boolean;

export const check =
  (targetSubStats: SubStat[], count: number = 1): CheckFunction =>
  (subStats: SubStat[]) =>
    targetSubStats.reduce(
      (acc, targetSubStat) =>
        acc + subStats.filter((subStat) => subStat === targetSubStat).length,
      0
    ) >= count;

export const AND =
  (...checkFunctions: CheckFunction[]): CheckFunction =>
  (subStats: SubStat[]) =>
    checkFunctions.every((checkFunction) => checkFunction(subStats));

export const OR =
  (...checkFunctions: CheckFunction[]): CheckFunction =>
  (subStats: SubStat[]) =>
    checkFunctions.some((checkFunction) => checkFunction(subStats));

export const NOT =
  (checkFunction: CheckFunction): CheckFunction =>
  (subStats: SubStat[]) =>
    !checkFunction(subStats);
