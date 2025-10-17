import mongoose from "mongoose";
import { Algorithm } from "jsonwebtoken";
import { StringValue } from "ms";
import { TEST_USER_EMAIL, TEST_USER_ID_STRING } from "../constants";
import { jwtService, SignTokenResult } from "../../services";
import { SignTestJwtArgs } from "./types";
import {
  DEFAULT_ALGORITHM_TOKEN,
  DEFAULT_EXPIRES_IN_TOKEN_STRING,
} from "../../constants";

export function signTestJwt(args?: SignTestJwtArgs): SignTokenResult {
  const defaultPayload = {
    email: TEST_USER_EMAIL,
    _id: new mongoose.Types.ObjectId(TEST_USER_ID_STRING),
  };

  const defaultOptions = {
    algorithm: DEFAULT_ALGORITHM_TOKEN,
    expiresIn: DEFAULT_EXPIRES_IN_TOKEN_STRING,
  };

  const payload = args?.payload
    ? { ...defaultPayload, ...args.payload }
    : defaultPayload;

  const options = args?.options
    ? { ...defaultOptions, ...args.options }
    : defaultOptions;

  return jwtService.sign({ payload, options });
}
