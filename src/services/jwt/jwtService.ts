import jwt, { TokenExpiredError } from "jsonwebtoken";
import { envVariables } from "../../common";
import { ERROR_MESSAGES } from "../../constants";
import {
  SignTokenArgs,
  SignTokenResult,
  VerifyTokenArgs,
  VerifyTokenResult,
} from "./types";
import {
  isExpiresInLessThanOne,
  isExpiresInNegative,
  isExpiresInNull,
  isExpiresInUndefined,
  isExpiresInWrongFormat,
  isValidSignTokenPayload,
} from "./helpers";

export function sign(args: SignTokenArgs): SignTokenResult {
  const { options, payload } = args;

  try {
    if (isExpiresInNull(options)) {
      return [null, { errors: [ERROR_MESSAGES.EXPIRES_IN_NULL] }];
    }

    if (isExpiresInUndefined(options)) {
      return [null, { errors: [ERROR_MESSAGES.EXPIRES_IN_UNDEFINED] }];
    }

    if (isExpiresInWrongFormat(options)) {
      return [null, { errors: [ERROR_MESSAGES.EXPIRES_IN_WRONG_FORMAT] }];
    }

    if (isExpiresInLessThanOne(options)) {
      return [null, { errors: [ERROR_MESSAGES.EXPIRES_IN_LESS_THAN_ONE] }];
    }

    if (isExpiresInNegative(options)) {
      return [null, { errors: [ERROR_MESSAGES.EXPIRES_IN_NEGATIVE] }];
    }

    if (!isValidSignTokenPayload(payload)) {
      return [null, { errors: [ERROR_MESSAGES.INVALID_PAYLOAD_SIGN_IN_TOKEN] }];
    }

    const token = jwt.sign(payload, envVariables.jwtSecretKey, options);
    return [token, null];
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("algorithm")) {
        return [
          null,
          { errors: [ERROR_MESSAGES.ERROR_TOKEN_SIGNATURE_ALGORITHM] },
        ];
      }
    }

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
