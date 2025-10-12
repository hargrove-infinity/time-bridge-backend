import { Algorithm } from "jsonwebtoken";
import { StringValue } from "ms";
import { jwtService } from "../../services";
import { SignTokenResult } from "../../types";
import { SignTestJwtArgs } from "./types";

export function signTestJwt(args?: SignTestJwtArgs): SignTokenResult {
  const defaultPayload = { email: "mail@mail.com" };
  const defaultOptions = {
    algorithm: "HS256" as Algorithm,
    expiresIn: "3h" as StringValue | number,
  };

  const payload = args?.payload || defaultPayload;
  const options = args?.options
    ? { ...defaultOptions, ...args.options }
    : defaultOptions;

  return jwtService.sign({ payload, options });
}

function verifySignJwt(args: SignTokenResult): void {
  const [token, errorSign] = args;

  expect(token).toBeDefined();
  expect(token).not.toBeNull();
  expect(typeof token).toBe("string");
  expect(errorSign).toBe(null);
}

export function signAndVerifyTestJwt(args?: SignTestJwtArgs): SignTokenResult {
  const result = signTestJwt(args);
  verifySignJwt(result);
  return result;
}
