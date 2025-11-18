import jwt, { TokenExpiredError } from "jsonwebtoken";
import { envVariables } from "../../common";
import { ERROR_DEFINITIONS, ERROR_MESSAGES } from "../../constants";
import { ApplicationError } from "../../errors";
import {
  SignTokenArgs,
  SignTokenResult,
  VerifyTokenArgs,
  VerifyTokenResult,
} from "./types";
import { isExpiresInLessThanOne, isExpiresInNegative } from "./helpers";

function sign(args: SignTokenArgs): SignTokenResult {
  const { options, payload } = args;

  try {
    if (isExpiresInLessThanOne(options)) {
      return [
        null,
        new ApplicationError({
          errorCode: ERROR_DEFINITIONS.EXPIRES_IN_LESS_THAN_ONE.code,
          errorDescription:
            ERROR_DEFINITIONS.EXPIRES_IN_LESS_THAN_ONE.description,
          statusCode: 500,
        }),
      ];
    }

    if (isExpiresInNegative(options)) {
      return [
        null,
        new ApplicationError({
          errorCode: ERROR_DEFINITIONS.EXPIRES_IN_NEGATIVE.code,
          errorDescription: ERROR_DEFINITIONS.EXPIRES_IN_NEGATIVE.description,
          statusCode: 500,
        }),
      ];
    }

    const token = jwt.sign(payload, envVariables.jwtSecretKey, options);
    return [token, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.ERROR_SIGNING_TOKEN.code,
        errorDescription: ERROR_DEFINITIONS.ERROR_SIGNING_TOKEN.description,
        statusCode: 500,
      }),
    ];
  }
}

function verify(args: VerifyTokenArgs): VerifyTokenResult {
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
