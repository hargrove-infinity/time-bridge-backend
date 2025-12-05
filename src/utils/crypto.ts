import { randomInt } from "crypto";
import { EMAIL_CONFIRM_CODE_LEN } from "../constants";

export function generateRandomStringCode(
  digits: number = EMAIL_CONFIRM_CODE_LEN
): string {
  const max = 10 ** digits;
  return randomInt(0, max).toString().padStart(digits, "0");
}
