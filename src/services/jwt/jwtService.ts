import jwt from "jsonwebtoken";
import { envVariables } from "../../common";
import { ERROR_MESSAGES } from "../../constants";
import { ISignTokenArgs, SignTokenResult } from "./types";

export function sign(args: ISignTokenArgs): SignTokenResult {
  const { options, payload } = args;

  try {
    const token = jwt.sign(payload, envVariables.jwtSecretKey, options);
    return [token, null];
  } catch (error) {
    return [null, { errors: [ERROR_MESSAGES.ERROR_SIGNING_TOKEN] }];
  }
}

export const jwtService = { sign } as const;
