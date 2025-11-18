import { Request, Response, NextFunction } from "express";
import { ERROR_DEFINITIONS } from "../../constants";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).send({
      errors: [
        {
          code: ERROR_DEFINITIONS.REQUEST_BODY_MISSING.code,
          description: ERROR_DEFINITIONS.REQUEST_BODY_MISSING.description,
          data: [],
        },
      ],
    });
  }

  res.status(500).send({
    errors: [
      {
        code: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.code,
        description: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.description,
        data: [],
      },
    ],
  });

  next();
};
