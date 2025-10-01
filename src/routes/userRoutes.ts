import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants";
import { userService } from "../services";
import { IUserCreateDto } from "../types";

async function create(req: Request<{}, {}, IUserCreateDto>, res: Response) {
  const { body } = req;

  const [, error] = await userService.create(body);

  if (error) {
    res.status(400).send({ errors: [ERROR_MESSAGES.USER_CREATE_ROUTE] });

    return;
  }

  res.status(200).send({ payload: SUCCESS_MESSAGES.USER_SUCCESSFULLY_CREATED });
}

export const userRoutes = { create } as const;
