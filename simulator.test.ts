import { assertEquals } from "@std/assert/equals";
import { firstClasses, ineffectiveClasses } from "./constants.ts";
import { AND, NOT, checkSubStats } from "./utils.ts";

Deno.test("checkSubStats", () => {
  assertEquals(
    NOT(checkSubStats(ineffectiveClasses, 2))([
      "ATK%",
      "EffectiveDMG",
      "IneffectiveDMG",
    ]),
    true
  );

  assertEquals(
    AND(
      NOT(checkSubStats(ineffectiveClasses, 2)),
      checkSubStats(firstClasses)
    )(["IneffectiveDMG", "IneffectiveDMG", "CritDmg"]),
    false
  );

  assertEquals(
    AND(
      NOT(checkSubStats(ineffectiveClasses, 2)),
      checkSubStats(firstClasses)
    )(["IneffectiveDMG", "ATK%", "EffectiveDMG"]),
    false
  );

  assertEquals(
    AND(
      NOT(checkSubStats(ineffectiveClasses, 2)),
      checkSubStats(firstClasses)
    )(["IneffectiveDMG", "ATK%", "CritDmg"]),
    true
  );
});
