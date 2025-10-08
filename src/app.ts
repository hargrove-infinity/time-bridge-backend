import express from "express";
import { paths } from "./constants";
import { userRouter } from "./routes";

const app = express();
app.use(express.json());

app.use(paths.users.base, userRouter);

export { app };
