import { Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";

interface SignTestJwtPayload {
  email?: string;
  _id?: Types.ObjectId;
}

export interface SignTestJwtArgs {
  payload?: SignTestJwtPayload;
  options?: jwt.SignOptions;
}
