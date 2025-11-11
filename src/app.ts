import express from "express";
import cors from "cors";
import { userRouter } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);

export { app };
