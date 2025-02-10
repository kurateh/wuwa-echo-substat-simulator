import {
  firstClasses,
  ineffectiveClasses,
  secondClasses,
} from "./constants.ts";
import { simulator, SubStatAlgorithm } from "./simulator.ts";
import { AND, check, NOT, OR } from "./utils.ts";

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
    AND(check(firstClasses, 2), check(secondClasses, 1)),
  ],
  "크크+1줄 / 첫 두줄 유효 이후 불가능하지 않으면 계속 도전": [
    () => true,
    check([...firstClasses, ...secondClasses]),
    () => true,
    OR(
      check(firstClasses, 2),
      AND(check(firstClasses, 1), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 1)),
  ],
  "크크+1줄 / 첫 두줄 유효, 3줄까지 크리 안나오거나 무효 2줄이면 버림": [
    () => true,
    check([...firstClasses, ...secondClasses]),
    OR(check(firstClasses), NOT(check(ineffectiveClasses, 2))),
    OR(
      check(firstClasses, 2),
      AND(check(firstClasses, 1), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 1)),
  ],
  "크크+1줄 / 첫 두줄 유효, 3줄까지 크리 안나오거나 무효 1줄이라도 있으면 버림":
    [
      () => true,
      check([...firstClasses, ...secondClasses]),
      OR(check(firstClasses), NOT(check(ineffectiveClasses, 1))),
      OR(
        check(firstClasses, 2),
        AND(check(firstClasses, 1), check(secondClasses, 1))
      ),
      AND(check(firstClasses, 2), check(secondClasses, 1)),
    ],
  "크크+1줄 / 첫 두줄 유효, 3줄까지 무효 2줄이면 버림": [
    () => true,
    check([...firstClasses, ...secondClasses]),
    NOT(check(ineffectiveClasses, 2)),
    OR(
      check(firstClasses, 2),
      AND(check(firstClasses, 1), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 1)),
  ],
  "크크+1줄 / 첫 두줄 크리, 3줄까지 크리 안나오거나 무효 2줄이면 버림": [
    () => true,
    check([...firstClasses]),
    NOT(check(ineffectiveClasses, 2)),
    OR(
      check(firstClasses, 2),
      AND(check(firstClasses, 1), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 1)),
  ],

  "크크+2줄 / 무지성": [
    () => true,
    () => true,
    () => true,
    () => true,
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],

  /** @see https://arca.live/b/wutheringwaves/109124220 */
  "크크+2줄 / 대학원생 알고리즘": [
    check([...firstClasses, ...secondClasses]),
    OR(check(firstClasses), check(secondClasses, 2)),
    OR(
      check(firstClasses, 2),
      check(secondClasses, 2),
      AND(check(firstClasses), check(secondClasses))
    ),
    OR(
      AND(check(firstClasses, 1), check(secondClasses, 2)),
      AND(check(firstClasses, 2), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],

  "크크+2줄 / 대학원생 알고리즘(2줄에 유효 1줄)": [
    () => true,
    check(secondClasses, 1),
    OR(
      check(firstClasses, 2),
      check(secondClasses, 2),
      AND(check(firstClasses), check(secondClasses))
    ),
    OR(
      AND(check(firstClasses, 1), check(secondClasses, 2)),
      AND(check(firstClasses, 2), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],

  "크크+2줄 / 대학원생 알고리즘(2줄에 크리 1줄)": [
    () => true,
    check(firstClasses, 1),
    OR(
      check(firstClasses, 2),
      check(secondClasses, 2),
      AND(check(firstClasses), check(secondClasses))
    ),
    OR(
      AND(check(firstClasses, 1), check(secondClasses, 2)),
      AND(check(firstClasses, 2), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],

  "크크+2줄 / 대학원생 알고리즘(1줄에 유효 1줄)": [
    check([...firstClasses, ...secondClasses]),
    () => true,
    OR(
      check(firstClasses, 2),
      check(secondClasses, 2),
      AND(check(firstClasses), check(secondClasses))
    ),
    OR(
      AND(check(firstClasses, 1), check(secondClasses, 2)),
      AND(check(firstClasses, 2), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],

  "크크+2줄 / 대학원생 알고리즘(1줄에 크리)": [
    check(firstClasses),
    () => true,
    OR(
      check(firstClasses, 2),
      check(secondClasses, 2),
      AND(check(firstClasses), check(secondClasses))
    ),
    OR(
      AND(check(firstClasses, 1), check(secondClasses, 2)),
      AND(check(firstClasses, 2), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],

  /** @see https://arca.live/b/wutheringwaves/110772941 */
  "크크+2줄 / 대학원생 알고리즘 + α": [
    check([...firstClasses, ...secondClasses]),
    OR(check(firstClasses), check(secondClasses, 2)),
    OR(check(firstClasses, 2), AND(check(firstClasses), check(secondClasses))),
    OR(
      AND(check(firstClasses, 1), check(secondClasses, 2)),
      AND(check(firstClasses, 2), check(secondClasses, 1))
    ),
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],
};

Object.entries(algorithms).forEach(([name, algorithm]) => {
  const { echoCountAvg, expAvg, tunerCountAvg, tunerEchoYield, tunerExpRatio } =
    simulator(algorithm, {
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
      simulationCount: 100000,
      onlyAcceptBestOptionWithATK: false,
    });
  console.log(`알고리즘: ${name}`);
  console.log(`평균 에코 개수: ${echoCountAvg}`);
  console.log(`평균 튜너 개수: ${tunerCountAvg}`);
  console.log(`튜너 에코 수율 점수: ${tunerEchoYield * 1000}`);
  console.log(
    `튜너 경험치 밸런스 (1보다 작을수록 경험치가 남음): ${
      tunerExpRatio / (25000 / 20)
    }`
  );
  console.log(`평균 경험치: ${expAvg} (골든음파통 ${expAvg / 5000}개)`);
  console.log("=====================================");
  console.log();
});
