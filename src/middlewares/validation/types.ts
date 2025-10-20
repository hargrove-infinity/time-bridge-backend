import { ZodObject, ZodPipe, ZodRawShape } from "zod";

export interface ValidateArgs {
  schema: ZodObject<ZodRawShape> | ZodPipe;
  key?: "params" | "body" | "query";
}
