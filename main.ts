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
  "무지성 크크 유효1줄": [
    () => true,
    () => true,
    () => true,
    () => true,
    AND(check(firstClasses, 2), check(secondClasses, 1)),
  ],
  "무지성 크크 유효2줄": [
    () => true,
    () => true,
    () => true,
    () => true,
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],

  /** @see https://arca.live/b/wutheringwaves/109124220 */
  "크크 유효2줄 최적화": [
    check([...firstClasses, ...secondClasses]),
    OR(check(firstClasses), check(secondClasses, 2)),
    NOT(check(ineffectiveClasses, 2)),
    NOT(check([...secondClasses, ...ineffectiveClasses], 4)),
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],

  /** @see https://arca.live/b/wutheringwaves/110772941 */
  "크크 유효2줄 최적화2": [
    check([...firstClasses, ...secondClasses]),
    OR(check(firstClasses), check(secondClasses, 2)),
    AND(NOT(check(ineffectiveClasses, 2)), check(firstClasses)),
    NOT(check([...secondClasses, ...ineffectiveClasses], 4)),
    AND(check(firstClasses, 2), check(secondClasses, 2)),
  ],
};

Object.entries(algorithms).forEach(([name, algorithm]) => {
  const { echoCountAvg, expAvg, tunerCountAvg } = simulator(algorithm, {
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
  console.log(`평균 경험치: ${expAvg} (골든음파통 ${expAvg / 5000}개)`);
  console.log("=====================================");
  console.log();
});
