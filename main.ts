import {
  criticalStats,
  ineffectiveClasses,
  effectiveStats,
} from "./constants.ts";
import { simulator, SubStatAlgorithm } from "./simulator.ts";
import { AND, check, NOT, OR } from "./utils.ts";
import * as XLSX from "xlsx";

/**
 * @FIXME
 * 알고리즘 목록
 */
const algorithms: Record<string, SubStatAlgorithm> = {
  "크크+1줄 / 무지성": [
    () => true,
    () => true,
    () => true,
    () => true,
    AND(check(criticalStats, 2), check(effectiveStats, 1)),
  ],
  "크크+1줄 / 2줄에 유효 1줄, 이후 불가능하지 않으면 계속 도전": [
    () => true,
    check([...criticalStats, ...effectiveStats]),
    () => true,
    OR(
      check(criticalStats, 2),
      AND(check(criticalStats, 1), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 1)),
  ],
  "크크+1줄 / 2줄에 유효 1줄, 3줄까지 크리 안나오면 버림": [
    () => true,
    check([...criticalStats, ...effectiveStats]),
    check(criticalStats),
    OR(
      check(criticalStats, 2),
      AND(check(criticalStats, 1), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 1)),
  ],
  "크크+1줄 / 2줄에 유효 1줄, 3줄까지 무효 2줄이면 버림": [
    () => true,
    check([...criticalStats, ...effectiveStats]),
    NOT(check(ineffectiveClasses, 2)),
    OR(
      check(criticalStats, 2),
      AND(check(criticalStats, 1), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 1)),
  ],
  "크크+1줄 / 2줄에 크리 1줄, 이후 불가능하지 않으면 계속 도전": [
    () => true,
    check([...criticalStats]),
    () => true,
    OR(
      check(criticalStats, 2),
      AND(check(criticalStats, 1), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 1)),
  ],
  "크크+1줄 / 2줄에 크리 1줄, 3줄까지 무효 2줄이면 버림": [
    () => true,
    check([...criticalStats]),
    NOT(check(ineffectiveClasses, 2)),
    OR(
      check(criticalStats, 2),
      AND(check(criticalStats, 1), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 1)),
  ],

  공백: [() => true, () => true, () => true, () => true, () => true],

  "크크+2줄 / 무지성": [
    () => true,
    () => true,
    () => true,
    () => true,
    AND(check(criticalStats, 2), check(effectiveStats, 2)),
  ],
  "크크+2줄 / 3줄에 유효 2줄": [
    () => true,
    () => true,
    OR(
      check(criticalStats, 2),
      check(effectiveStats, 2),
      AND(check(criticalStats), check(effectiveStats))
    ),
    OR(
      AND(check(criticalStats, 1), check(effectiveStats, 2)),
      AND(check(criticalStats, 2), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 2)),
  ],

  /** @see https://arca.live/b/wutheringwaves/109124220 */
  "크크+2줄 / 대학원생 알고리즘": [
    check([...criticalStats, ...effectiveStats]),
    OR(check(criticalStats), check(effectiveStats, 2)),
    OR(
      check(criticalStats, 2),
      check(effectiveStats, 2),
      AND(check(criticalStats), check(effectiveStats))
    ),
    OR(
      AND(check(criticalStats, 1), check(effectiveStats, 2)),
      AND(check(criticalStats, 2), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 2)),
  ],

  /** @see https://arca.live/b/wutheringwaves/110772941 */
  "크크+2줄 / 대학원생 알고리즘 + α": [
    check([...criticalStats, ...effectiveStats]),
    OR(check(criticalStats), check(effectiveStats, 2)),
    OR(
      check(criticalStats, 2),
      AND(check(criticalStats), check(effectiveStats))
    ),
    OR(
      AND(check(criticalStats, 1), check(effectiveStats, 2)),
      AND(check(criticalStats, 2), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 2)),
  ],

  "크크+2줄 / 1줄에 유효 1줄": [
    check([...criticalStats, ...effectiveStats]),
    () => true,
    OR(
      check(criticalStats, 2),
      check(effectiveStats, 2),
      AND(check(criticalStats), check(effectiveStats))
    ),
    OR(
      AND(check(criticalStats, 1), check(effectiveStats, 2)),
      AND(check(criticalStats, 2), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 2)),
  ],

  "크크+2줄 / 2줄에 유효 1줄": [
    () => true,
    check([...criticalStats, ...effectiveStats], 1),
    OR(
      check(criticalStats, 2),
      check(effectiveStats, 2),
      AND(check(criticalStats), check(effectiveStats))
    ),
    OR(
      AND(check(criticalStats, 1), check(effectiveStats, 2)),
      AND(check(criticalStats, 2), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 2)),
  ],

  "크크+2줄 / 1줄에 크리 1줄": [
    check(criticalStats),
    () => true,
    OR(
      check(criticalStats, 2),
      check(effectiveStats, 2),
      AND(check(criticalStats), check(effectiveStats))
    ),
    OR(
      AND(check(criticalStats, 1), check(effectiveStats, 2)),
      AND(check(criticalStats, 2), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 2)),
  ],

  "크크+2줄 / 2줄에 크리 1줄": [
    () => true,
    check(criticalStats, 1),
    OR(
      check(criticalStats, 2),
      check(effectiveStats, 2),
      AND(check(criticalStats), check(effectiveStats))
    ),
    OR(
      AND(check(criticalStats, 1), check(effectiveStats, 2)),
      AND(check(criticalStats, 2), check(effectiveStats, 1))
    ),
    AND(check(criticalStats, 2), check(effectiveStats, 2)),
  ],
};

const rows: unknown[] = [];

Object.entries(algorithms).forEach(([name, algorithm]) => {
  const {
    echoCountAvg,
    expAvg,
    tunerCountAvg,
    tunerEchoYield,
    tunerExpRatio,
    bottom10PercentEchoCount,
    bottom10PercentTunerCount,
  } = simulator(algorithm, {
    /**
     * @FIXME
     * 시뮬레이션 옵션
     *
     * simulationCount: 시뮬레이션 횟수
     *
     * onlyAcceptBestOptionWithATK: 깡공격력이 뜰 경우 가장 높은 값인 60만 받아들일지 여부
     * 이 때 확률값은 https://imgur.com/a/WG3Kz5x을 사용하며,
     * 기준인 60은 https://arca.live/b/wutheringwaves/110955224을 참고
     *
     */
    simulationCount: 1000000,
    onlyAcceptBestOptionWithATK: false,
    excludeMinCritCritDmg: true,
  });

  const record: (typeof rows)[number] = {
    알고리즘: name,
    "소모 에코": echoCountAvg,
    "소모 튜너": tunerCountAvg,
    "에코 수율 점수": tunerEchoYield * 1000,
    "경험치 밸런스": tunerExpRatio / (25000 / 20),
    골든음파통: expAvg / 5000,
    "하위 10% 에코": bottom10PercentEchoCount,
    "하위 10% 튜너": bottom10PercentTunerCount,
  };

  rows.push(record);

  console.table(record);
});

const worksheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "시뮬레이션 결과");

XLSX.writeFile(workbook, "시뮬레이션 결과.xlsx");
