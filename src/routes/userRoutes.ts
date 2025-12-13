import { Request, Response } from "express";
import { userService } from "../services";
import { UserInput, EmailConfirmInput, EmailInput } from "../validation";

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

async function emailConfirm(
  req: Request<{}, {}, EmailConfirmInput>,
  res: Response
): Promise<void> {
  const { body } = req;

  const [token, error] = await userService.emailConfirm(body);

  if (error) {
    res.status(error.statusCode).send({ errors: error.buildErrorPayload() });
    return;
  }

  res.status(200).send({ payload: token });
}

async function resendCode(
  req: Request<{}, {}, EmailInput>,
  res: Response
): Promise<void> {
  // TODO: refactor payload
  res.status(200).send({ payload: "{nextResendTime}" });
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

export const userRoutes = {
  register,
  emailConfirm,
  resendCode,
  login,
} as const;
