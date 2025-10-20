import { Request, Response, NextFunction } from "express";
import { ValidateArgs } from "./types";

export function createValidateMiddleware<T>({
  schema,
  key = "body",
}: ValidateArgs) {
  function validateMiddleware(
    req: Request<T>,
    res: Response,
    next: NextFunction
  ): void {
    const result = schema.safeParse(req[key]);

    if (!result.success) {
      const errorMessages = result.error.issues.map((errItm) => errItm.message);
      res.status(400).send({ errors: errorMessages });
      return;
    }

    req[key] = result.data;
    next();
  }

  return { validateMiddleware };
}
