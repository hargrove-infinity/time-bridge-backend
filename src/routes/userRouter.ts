import { Router } from "express";
import { paths } from "../constants";
import { middlewares } from "../middlewares";
import { userValidationSchema } from "../validation";
import { userRoutes } from "./userRoutes";

export const userRouter = Router();

userRouter.post(
  paths.common.base,
  middlewares.validate({ schema: userValidationSchema }),
  userRoutes.create
);

userRouter.post(
  paths.users.login,
  middlewares.validate({ schema: userValidationSchema }),
  userRoutes.login
);
