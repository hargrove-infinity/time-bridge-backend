import { Request, Response, NextFunction } from "express";
import { ValidateArgs, ValidateReturn } from "./types";
import { buildValidationErrorsPayload } from "./helpers";

export function validate<T>({
  schema,
  key = "body",
}: ValidateArgs): ValidateReturn<T> {
  return (req: Request<T>, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[key]);

    if (!result.success) {
      const errorsPayload = buildValidationErrorsPayload({
        issues: result.error.issues,
        body: req.body,
      });

      res.status(400).send({ errors: errorsPayload });
      return;
    }

    req[key] = result.data;
    next();
  };
}
