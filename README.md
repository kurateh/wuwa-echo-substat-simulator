# 명조 에코 부옵션 강화 알고리즘 시뮬레이터

[명조](https://wutheringwaves.kurogames.com/kr/main)에서 부옵션을 강화하는 알고리즘을 시뮬레이션하는 deno 스크립트

## Requirements
- deno@^2

## Usage
```sh
deno run main.ts
```

### `main.ts`

```ts
/**
 * @FIXME
 * 알고리즘 목록
 */
const algorithms: Record<string, SubStatAlgorithm> = {
  /* ... */
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
  /* ... */
});
```

`@FIXME`로 표시된 부분을 적절히 수정하여 사용한다.