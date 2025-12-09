import { Router } from "express";
import { paths } from "../constants";
import { middlewares } from "../middlewares";
import {
  userValidationSchema,
  emailConfirmValidationSchema,
  emailValidationSchema,
} from "../validation";
import { userRoutes } from "./userRoutes";

export const userRouter = Router();

userRouter.post(
  paths.auth.register,
  middlewares.validate({ schema: userValidationSchema }),
  userRoutes.register
);

userRouter.post(
  paths.auth.emailConfirm,
  middlewares.validate({ schema: emailConfirmValidationSchema }),
  userRoutes.emailConfirm
);

userRouter.post(
  paths.auth.resendCode,
  middlewares.validate({ schema: emailValidationSchema }),
  userRoutes.resendCode
);

userRouter.post(
  paths.auth.login,
  middlewares.validate({ schema: userValidationSchema }),
  userRoutes.login
);
