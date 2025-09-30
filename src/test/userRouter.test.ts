import express, { Express } from "express";
import request from "supertest";
import { ERROR_MESSAGES, paths } from "../constants";
import { userRoutes } from "../routes/userRoutes";
// Create the spy at module level, before userRouter is imported
const spy = jest.spyOn(userRoutes, "create");
import { userRouter } from "../routes/userRouter";

let app: Express;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(paths.users.base, userRouter);
});

describe("userRouter.create", () => {
  test("should fail validation: body in undefined", async () => {
    const response = await request(app).post(paths.users.base).send();
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain(
      ERROR_MESSAGES.USER_CREATION_BODY_UNDEFINED
    );
  });

  test("should call userRoutes.create", async () => {
    await request(app)
      .post(paths.users.base)
      .send({ email: "mail@mail.com", password: "password" });
    expect(spy).toHaveBeenCalled();
  });

  test("should receive 200 status code", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: "mail@mail.com", password: "password" });
    expect(response.status).toBe(200);
  });
});
