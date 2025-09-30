import { Router } from "express";
import { paths } from "../constants";
import { validate } from "../middlewares";
import { userValidationSchema } from "../validation";
import { userRoutes } from "./userRoutes";

export const userRouter = Router();

userRouter.post(
  paths.common.base,
  validate({ schema: userValidationSchema }),
  userRoutes.create
);
