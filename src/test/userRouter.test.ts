import express, { Express } from "express";
import request from "supertest";
import { paths } from "../constants";
import { userRoutes } from "../routes/userRoutes";
// Create the spy at module level, before userRouter is imported
const spy = jest.spyOn(userRoutes, "create");
import { userRouter } from "../routes/userRouter";

let app: Express;

beforeAll(() => {
  app = express();
  app.use(paths.users.base, userRouter);
});

describe("userRouter.create", () => {
  test("should call userRoutes.create", async () => {
    await request(app).post(paths.users.base);
    expect(spy).toHaveBeenCalled();
  });

  test("should receive 200 status code", async () => {
    const response = await request(app).post(paths.users.base);
    expect(response.status).toBe(200);
  });
});
