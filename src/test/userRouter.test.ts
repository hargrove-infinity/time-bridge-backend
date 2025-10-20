import express, { Express } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import { ERROR_MESSAGES, paths } from "../constants";
import { UserModel } from "../models";
import { closeConnectionDatabase, connectDatabase } from "../utils";

// Import and spy on validation middleware
import { middlewares } from "../middlewares";
const spyOnValidationMiddleware = jest.spyOn(middlewares, "validate");

// Import and spy on userRoutes.create
import { userRoutes } from "../routes/userRoutes";

// Create the spy at module level, BEFORE userRouter is imported
const spyOnUserRoutesCreate = jest.spyOn(userRoutes, "create");
const spyOnUserRoutesLogin = jest.spyOn(userRoutes, "login");

// Import userRouter AFTER creating a spy
import { userRouter } from "../routes/userRouter";

import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./constants";
import { expectCreateUserRequest, expectJwtPayload } from "./utils";

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

describe("userRouter", () => {
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

    test("should respond with correct payload", async () => {
      await expectCreateUserRequest(app);
    });
  });

  describe("userRouter.login", () => {
    test("should call validate middleware", async () => {
      await request(app).post(paths.users.login).send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });
      expect(spyOnValidationMiddleware).toHaveBeenCalled();
    });

    test("should call userRoutes.login", async () => {
      await request(app)
        .post(`${paths.users.base}${paths.users.login}`)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });

      expect(spyOnUserRoutesLogin).toHaveBeenCalled();
    });

    test("should receive 200 status code", async () => {
      const responseCreateUser = await request(app)
        .post(paths.users.base)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      expect(responseCreateUser.status).toBe(200);

      const responseLoginUser = await request(app)
        .post(`${paths.users.base}${paths.users.login}`)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      expect(responseLoginUser.status).toBe(200);
    });

    test("should respond with correct payload", async () => {
      await expectCreateUserRequest(app);

      const response = await request(app)
        .post(`${paths.users.base}${paths.users.login}`)
        .send({
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD,
        });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ payload: expect.any(String) });

      const decoded = jwt.decode(response.body.payload);

      expectJwtPayload(decoded);

      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
    });

    test("should return 400 when email does not exist", async () => {
      const response = await request(app)
        .post(`${paths.users.base}${paths.users.login}`)
        .send({
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [ERROR_MESSAGES.USER_EMAIL_NOT_EXIST],
      });
    });

    test.todo("should return 400 when password is incorrect");
  });
});
