import mongoose from "mongoose";
import { Algorithm } from "jsonwebtoken";
import { StringValue } from "ms";
import { TEST_USER_EMAIL, TEST_USER_ID_STRING } from "../constants";
import { jwtService, SignTokenResult } from "../../services";
import { SignTestJwtArgs } from "./types";

export function signTestJwt(args?: SignTestJwtArgs): SignTokenResult {
  const defaultPayload = {
    email: TEST_USER_EMAIL,
    _id: new mongoose.Types.ObjectId(TEST_USER_ID_STRING),
  };

  const defaultOptions = {
    algorithm: "HS256" as Algorithm,
    expiresIn: "3h" as StringValue | number,
  };

  const payload = args?.payload
    ? { ...defaultPayload, ...args.payload }
    : defaultPayload;

  const options = args?.options
    ? { ...defaultOptions, ...args.options }
    : defaultOptions;

  return jwtService.sign({ payload, options });
}

export function verifySignJwt(
  data: SignTokenResult
): asserts data is [string, null] {
  const [token, errorSign] = data;

  expect(token).toBeDefined();
  expect(token).not.toBeNull();
  expect(typeof token).toBe("string");
  expect(errorSign).toBe(null);
}
