import express, { Express } from "express";
import request from "supertest";
import { paths } from "../constants";
import { UserModel } from "../models";
import { closeConnectionDatabase, connectDatabase } from "../utils";

// Import and spy on validation middleware
import { middlewares } from "../middlewares";
const spyOnValidationMiddleware = jest.spyOn(middlewares, "validate");

// Import and spy on userRoutes.create
import { userRoutes } from "../routes/userRoutes";
// Create the spy at module level, BEFORE userRouter is imported
const spyOnUserRoutesCreate = jest.spyOn(userRoutes, "create");
// Import userRouter AFTER creating a spy
import { userRouter } from "../routes/userRouter";

import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./constants";
import { expectToFulfillCreateUserRequest } from "./utils";

let app: Express;

beforeAll(async () => {
  await connectDatabase();

  app = express();
  app.use(express.json());
  app.use(paths.users.base, userRouter);
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("userRouter.create", () => {
  test("should call validate middleware", async () => {
    await request(app).post(paths.users.base).send({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });
    expect(spyOnValidationMiddleware).toHaveBeenCalled();
  });

  test("should call userRoutes.create", async () => {
    await request(app)
      .post(paths.users.base)
      .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
    expect(spyOnUserRoutesCreate).toHaveBeenCalled();
  });

  test("should receive 200 status code", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
    expect(response.status).toBe(200);
  });

  test("should respond with confirmation message when correct input is provided", async () => {
    await expectToFulfillCreateUserRequest(app);
  });
});
