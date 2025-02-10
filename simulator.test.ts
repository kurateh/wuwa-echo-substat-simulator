import { assertEquals } from "@std/assert/equals";
import { firstClasses, ineffectiveClasses } from "./constants.ts";
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
      check(firstClasses)
    )(["IneffectiveDMG", "IneffectiveDMG", "CritDmg"]),
    false
  );

  assertEquals(
    AND(
      NOT(check(ineffectiveClasses, 2)),
      check(firstClasses)
    )(["IneffectiveDMG", "ATK%", "EffectiveDMG"]),
    false
  );

  assertEquals(
    AND(
      NOT(check(ineffectiveClasses, 2)),
      check(firstClasses)
    )(["IneffectiveDMG", "ATK%", "CritDmg"]),
    true
  );
});
