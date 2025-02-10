import { assertEquals } from "@std/assert/equals";
import { criticalStats, ineffectiveClasses } from "./constants.ts";
import { AND, NOT, check } from "./utils.ts";

Deno.test("checkSubStats", () => {
  assertEquals(
    NOT(check(ineffectiveClasses, 2))([
      "ATK%",
      "EffectiveDMG",
      "IneffectiveDMG",
    ]),
    true
  );

  assertEquals(
    AND(
      NOT(check(ineffectiveClasses, 2)),
      check(criticalStats)
    )(["IneffectiveDMG", "IneffectiveDMG", "CritDmg"]),
    false
  );

  assertEquals(
    AND(
      NOT(check(ineffectiveClasses, 2)),
      check(criticalStats)
    )(["IneffectiveDMG", "ATK%", "EffectiveDMG"]),
    false
  );

  assertEquals(
    AND(
      NOT(check(ineffectiveClasses, 2)),
      check(criticalStats)
    )(["IneffectiveDMG", "ATK%", "CritDmg"]),
    true
  );
});
