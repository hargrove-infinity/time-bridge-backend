import { Router } from "express";
import { paths } from "../constants";
import { middlewares } from "../middlewares";
import { userValidationSchema } from "../validation";
import { userRoutes } from "./userRoutes";

export const userRouter = Router();

userRouter.post(
  paths.auth.register,
  middlewares.validate({ schema: userValidationSchema }),
  userRoutes.register
);

userRouter.post(
  paths.auth.login,
  middlewares.validate({ schema: userValidationSchema }),
  userRoutes.login
);
