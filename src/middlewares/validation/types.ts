import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodPipe, ZodRawShape } from "zod";
import * as z from "zod/v4/core";

export interface ValidateArgs {
  schema: ZodObject<ZodRawShape> | ZodPipe;
  key?: "params" | "body" | "query";
}

export type ValidateReturn<T> = (
  req: Request<T>,
  res: Response,
  next: NextFunction
) => void;

export interface BuildValidationErrorsPayloadArgs {
  body: Record<string, any>;
  issues: z.$ZodIssue[];
}

export interface ErrorPayloadItem {
  code: string;
  description: string;
  data: string[];
}
