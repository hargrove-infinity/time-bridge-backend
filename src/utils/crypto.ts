import { randomInt } from "crypto";

export function generateRandomStringCode(digits: number = 6): string {
  const max = 10 ** digits;
  return randomInt(0, max).toString().padStart(digits, "0");
}
