import { Types } from "mongoose";
import jwt, { Jwt, JwtPayload, VerifyOptions } from "jsonwebtoken";
import { ErrorData } from "../../types";

interface SignAuthTokenPayload {
  email: string;
  _id: Types.ObjectId;
}

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
