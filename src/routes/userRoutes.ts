import { Request, Response } from "express";
import { userService } from "../services";
import { CreateUserInput } from "../validation";

async function register(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
): Promise<void> {
  const { body } = req;

  const [token, error] = await userService.register(body);

  if (error) {
    res.status(error.statusCode).send({ errors: error.buildErrorPayload() });
    return;
  }

  res.status(200).send({ payload: token });
}

async function login(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
): Promise<void> {
  const { body } = req;

  const [token, error] = await userService.login(body);

  if (error) {
    res.status(400).send(error);
    return;
  }

  res.status(200).send({ payload: token });
}

export const userRoutes = { register, login } as const;
