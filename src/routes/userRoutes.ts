import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../constants";
import { userService } from "../services";
import { CreateUserInput } from "../validation";

async function create(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
): Promise<void> {
  const { body } = req;

  const [token, error] = await userService.create(body);

  if (error) {
    res.status(400).send({ errors: [ERROR_MESSAGES.USER_CREATE_ROUTE] });
    return;
  }

  res.status(200).send({ payload: token });
}

async function login(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
): Promise<void> {
  const { body } = req;

  await userService.login(body);
}

export const userRoutes = { create, login } as const;
