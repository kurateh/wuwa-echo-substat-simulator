import { spentExps, SubStat } from "./constants.ts";
import { randomPick } from "./utils.ts";

export type SubStatAlgorithm = [
  (subStats: SubStat[]) => boolean,
  (subStats: SubStat[]) => boolean,
  (subStats: SubStat[]) => boolean,
  (subStats: SubStat[]) => boolean,
  (subStats: SubStat[]) => boolean
];

export const simulator = (
  algorithm: SubStatAlgorithm,
  options?: {
    simulationCount?: number;
    onlyAcceptBestOptionWithATK?: boolean;
    excludeMinCritCritDmg?: boolean;
  }
) => {
  type State = { echoCount: number; tunerCount: number; exp: number };
  const {
    simulationCount = 100000,
    onlyAcceptBestOptionWithATK = false,
    excludeMinCritCritDmg = false,
  } = options ?? {};

  const echoCountResults: number[] = [];
  const tunerCountResults: number[] = [];
  const expResults: number[] = [];

  let subStats: SubStat[] = [];
  let currentState: State = { echoCount: 0, tunerCount: 0, exp: 0 };
  let remainedSubStats: SubStat[] = [];

  const initialize = () => {
    subStats = [];
    remainedSubStats = [
      "CritDmg",
      "CritRate",
      "ATK%",
      "HP%",
      "DEF%",
      "EffectiveDMG",
      "IneffectiveDMG",
      "IneffectiveDMG",
      "IneffectiveDMG",
      "EnergyRegen",
      "HP",
      "DEF",
      "ATK",
    ];
  };

  for (let i = 0; i < simulationCount; i++) {
    currentState = { echoCount: 0, tunerCount: 0, exp: 0 };
    initialize();

    while (true) {
      let success = true;
      let spentExp = 0;
      let spentTuner = 0;
      let passedCritCondition = false;
      initialize();

      const getRefund = () => {
        // 환급
        currentState.exp -= spentExp * 0.75;
        currentState.tunerCount -= spentTuner * 0.3;
        // console.log(`폐기된 에코 옵션: ${subStats.join(", ")}`);
      };

      // 에코 하나 강화 시작
      currentState.echoCount++;
      // (line + 1) * 5강까지 강화
      for (let line = 0; line < algorithm.length; line++) {
        spentExp += spentExps[line];
        spentTuner += 10;

        const pickedIndex = randomPick(remainedSubStats.length);
        const picked = remainedSubStats[pickedIndex];
        subStats.push(
          onlyAcceptBestOptionWithATK
            ? picked !== "ATK" || Math.random() < 0.1036
              ? picked
              : "IneffectiveDMG"
            : picked
        );
        remainedSubStats = remainedSubStats.filter(
          (_, index) => index !== pickedIndex
        );

        if (!algorithm[line](subStats)) {
          success = false;

          // 선환급
          getRefund();
          break;
        }

        if (excludeMinCritCritDmg && !passedCritCondition) {
          if (
            subStats.filter((v) => v === "CritDmg" || v === "CritRate")
              .length >= 2
          ) {
            if (Math.random() > 1 - 0.0733 * 0.0733) {
              success = false;

              // 선환급
              getRefund();
              break;
            }

            passedCritCondition = true;
          }
        }
      }

      // 강화 비용 반영
      currentState.exp += spentExp;
      currentState.tunerCount += spentTuner;

      if (success) {
        // console.log(`성공한 에코 옵션: ${subStats.join(", ")}`);
        echoCountResults.push(currentState.echoCount);
        tunerCountResults.push(currentState.tunerCount);
        expResults.push(currentState.exp);
        break;
      }
    }
  }

  return {
    echoCountAvg:
      echoCountResults.reduce((a, b) => a + b, 0) / echoCountResults.length,
    tunerCountAvg:
      tunerCountResults.reduce((a, b) => a + b, 0) / tunerCountResults.length,
    expAvg: expResults.reduce((a, b) => a + b, 0) / expResults.length,
    tunerEchoYield:
      echoCountResults
        .map((v, i) => 1 / v / tunerCountResults[i])
        .reduce((a, b) => a + b, 0) / echoCountResults.length,
    tunerExpRatio:
      expResults
        .map((v, i) => v / tunerCountResults[i])
        .reduce((a, b) => a + b, 0) / expResults.length,
  };
};
