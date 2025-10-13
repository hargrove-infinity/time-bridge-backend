import jwt from "jsonwebtoken";
import ms from "ms";

export function isExpiresInLessThanOne(options?: jwt.SignOptions): boolean {
  return typeof options?.expiresIn === "number" && options?.expiresIn < 1;
}

export function isExpiresInNegative(options?: jwt.SignOptions): boolean {
  return (
    typeof options?.expiresIn === "string" && options?.expiresIn.startsWith("-")
  );
}

export function isExpiresInNull(options?: jwt.SignOptions): boolean {
  return options?.expiresIn === null;
}

export function isExpiresInUndefined(options?: jwt.SignOptions): boolean {
  return options?.expiresIn === undefined;
}

export function isExpiresInWrongFormat(options?: jwt.SignOptions): boolean {
  return Boolean(
    options &&
      options.expiresIn &&
      ms(options.expiresIn as number) === undefined
  );
}

export function isValidSignTokenPayload(payload: unknown): boolean {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      "email" in payload &&
      typeof payload.email === "string" &&
      payload.email.length
  );
}
