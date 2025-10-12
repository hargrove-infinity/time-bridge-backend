import jwt from "jsonwebtoken";
import { SignAuthTokenPayload } from "../../types";

export interface SignTestJwtArgs {
  payload?: SignAuthTokenPayload;
  options?: jwt.SignOptions;
}
