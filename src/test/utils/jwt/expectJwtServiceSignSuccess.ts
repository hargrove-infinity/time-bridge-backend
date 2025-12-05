import { expectSignTokenResult } from "./expectSignTokenResult";
import { signTestJwt } from "./signTestJwt";
import { SignTestJwtArgs } from "./types";

export function expectJwtServiceSignSuccess(args?: SignTestJwtArgs) {
  const result = signTestJwt(args);
  expectSignTokenResult(result);
  return result;
}
