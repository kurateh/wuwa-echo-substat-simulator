import { assertEquals } from "@std/assert/equals";
import { ineffectiveClasses } from "./constants.ts";
import { NOT, checkSubStats } from "./utils.ts";

Deno.test("checkSubStats", () => {
  assertEquals(
    NOT(checkSubStats(ineffectiveClasses, 2))([
      "ATK%",
      "EffectiveDMG",
      "IneffectiveDMG",
    ]),
    true
  );
});
