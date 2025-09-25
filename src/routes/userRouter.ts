import { Router } from "express";
import { paths } from "../constants";
import { userRoutes } from "./userRoutes";

export const userRouter = Router();

userRouter.post(paths.common.base, userRoutes.create);
