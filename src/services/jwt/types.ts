import jwt from "jsonwebtoken";
import { ErrorData } from "../../types";

interface ISignAuthTokenPayload {
  email: string;
}

export interface ISignTokenArgs {
  payload: ISignAuthTokenPayload;
  options?: jwt.SignOptions;
}

export type SignTokenResult = [string, null] | [null, ErrorData];
