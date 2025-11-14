import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { userRouter } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error(err);
        return res.status(400).send({ status: 400, message: err.message })
    }
    
    console.error(err)
    res.status(500).send({ status: 500, message: "Internal Server Error" })
    next()
})

export { app };
