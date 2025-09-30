import { Request, Response, NextFunction } from "express";
import { IValidateArgs, ValidateReturn } from "./types";

export function validate<T>({
  schema,
  key = "body",
}: IValidateArgs): ValidateReturn<T> {
  return (req: Request<T>, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[key]);

    if (!result.success) {
      const errorMessages = result.error.issues.map((errItm) => errItm.message);
      res.status(400).send({ errors: errorMessages });
      return;
    }

    req[key] = result.data;
    next();
  };
}
