import jwt from "jsonwebtoken";

export function isExpiresInLessThanOne(options?: jwt.SignOptions): boolean {
  return typeof options?.expiresIn === "number" && options?.expiresIn < 1;
}

export function isExpiresInNegative(options?: jwt.SignOptions): boolean {
  return (
    typeof options?.expiresIn === "string" && options?.expiresIn.startsWith("-")
  );
}
