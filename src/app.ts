import express from "express";
// import { paths } from "./constants";
import { userRouter } from "./routes";

const app = express();

// NOTE: prefix with "/users" from useeRouter
// app.use(paths.users.base, userRouter);
app.use(userRouter);

// Prev
// userRouter.post("/", userRoutes.create);
// app.use("/users", userRouter);

// Now
// userRouter.post("/users", userRoutes.create);
// app.use( userRouter);

export { app };
