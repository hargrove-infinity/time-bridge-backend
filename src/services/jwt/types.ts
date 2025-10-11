import jwt, { Jwt, JwtPayload, VerifyOptions } from "jsonwebtoken";
import { ErrorData } from "../../types";

interface SignAuthTokenPayload {
  email: string;
}

export interface SignTokenArgs {
  payload: SignAuthTokenPayload;
  options?: jwt.SignOptions;
}

export interface VerifyTokenArgs {
  token: string;
  options?: VerifyOptions;
}

export type SignTokenResult = [string, null] | [null, ErrorData];

export type VerifyTokenResult =
  | [Jwt | JwtPayload | string, null]
  | [null, ErrorData];
