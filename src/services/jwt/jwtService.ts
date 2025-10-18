import jwt, { TokenExpiredError } from "jsonwebtoken";
import { envVariables } from "../../common";
import { ERROR_MESSAGES } from "../../constants";
import {
  SignTokenArgs,
  SignTokenResult,
  VerifyTokenArgs,
  VerifyTokenResult,
} from "./types";
import { isExpiresInLessThanOne, isExpiresInNegative } from "./helpers";

export function sign(args: SignTokenArgs): SignTokenResult {
  const { options, payload } = args;

  try {
    if (isExpiresInLessThanOne(options)) {
      return [null, { errors: [ERROR_MESSAGES.EXPIRES_IN_LESS_THAN_ONE] }];
    }

    if (isExpiresInNegative(options)) {
      return [null, { errors: [ERROR_MESSAGES.EXPIRES_IN_NEGATIVE] }];
    }

    const token = jwt.sign(payload, envVariables.jwtSecretKey, options);
    return [token, null];
  } catch (error) {
    return [null, { errors: [ERROR_MESSAGES.ERROR_SIGNING_TOKEN] }];
  }
}

export function verify(args: VerifyTokenArgs): VerifyTokenResult {
  const { options, token } = args;

  try {
    const result = jwt.verify(token, envVariables.jwtSecretKey, options);
    return [result, null];
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return [null, { errors: [ERROR_MESSAGES.TOKEN_EXPIRED] }];
    }

    return [null, { errors: [ERROR_MESSAGES.ERROR_VERIFYING_TOKEN] }];
  }
}

export const jwtService = { sign, verify } as const;
