import { Request, Response } from "express";
import { userService } from "../services";

async function create(req: Request, res: Response) {
  userService.create();
  res.send("OK");
}

export const userRoutes = { create } as const;
