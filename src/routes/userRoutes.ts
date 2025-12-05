import { Request, Response } from "express";
import { userService } from "../services";
import { UserInput, EmailConfirmInput } from "../validation";

async function register(
  req: Request<{}, {}, UserInput>,
  res: Response
): Promise<void> {
  const { body } = req;

  const [token, error] = await userService.register(body);

  if (error) {
    console.log("userRoutes.register: ", error);

    res.status(error.statusCode).send({ errors: error.buildErrorPayload() });
    return;
  }

  res.status(200).send({ payload: token });
}

async function login(
  req: Request<{}, {}, UserInput>,
  res: Response
): Promise<void> {
  const { body } = req;

  const [token, error] = await userService.login(body);

  if (error) {
    res.status(error.statusCode).send({ errors: error.buildErrorPayload() });
    return;
  }

  res.status(200).send({ payload: token });
}

async function emailConfirm(
  req: Request<{}, {}, EmailConfirmInput>,
  res: Response
): Promise<void> {
  // TODO refactor
  res.status(200).send({ payload: "token" });
}

export const userRoutes = { register, login, emailConfirm } as const;
