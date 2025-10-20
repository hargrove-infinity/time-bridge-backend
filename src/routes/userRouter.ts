import { Router } from "express";
import { paths } from "../constants";
import { userRoutes } from "./userRoutes";

export function createUserRouter(
  validateForCreate: any,
  validateForLogin: any
) {
  const router = Router();

  router.post(
    paths.common.base,
    validateForCreate.validateMiddleware,
    userRoutes.create
  );

  router.post(
    paths.users.login,
    validateForLogin.validateMiddleware,
    userRoutes.login
  );

  return router;
}

import { middlewares } from "../middlewares";
import { userValidationSchema } from "../validation";

const validateForCreate = middlewares.createValidateMiddleware({
  schema: userValidationSchema,
});

const validateForLogin = middlewares.createValidateMiddleware({
  schema: userValidationSchema,
});

export const userRouter = createUserRouter(validateForCreate, validateForLogin);
