import jwt, { Jwt, JwtPayload, VerifyOptions } from "jsonwebtoken";
import { ErrorData, SignAuthTokenPayload } from "../../types";

export interface SignTokenArgs {
  payload: SignAuthTokenPayload;
  options?: jwt.SignOptions;
}

export interface VerifyTokenArgs {
  token: string;
  options?: VerifyOptions;
}

export type VerifyTokenResult =
  | [Jwt | JwtPayload | string, null]
  | [null, ErrorData];
