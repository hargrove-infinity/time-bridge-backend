import express from "express";
import cors from "cors";
import { userRouter } from "./routes";
import { errorHandler } from "./middlewares";

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);

app.use(errorHandler);

export { app };
