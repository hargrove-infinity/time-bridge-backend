import { Router } from "express";
import { paths } from "../constants";
import { middlewares } from "../middlewares";
import { userValidationSchema } from "../validation";
import { userRoutes } from "./userRoutes";

export const userRouter = Router();

userRouter.post(
  // NOTE: replaced path "/" with "/users"
  // paths.common.base,
  paths.users.base,
  middlewares.validate({ schema: userValidationSchema }),
  userRoutes.create
);
