import express, { Express } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import { ERROR_MESSAGES, paths } from "../constants";
import { UserModel } from "../models";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { userRoutes } from "../routes/userRoutes";

// Create the spy at module level, BEFORE userRouter is imported
const spyOnUserRoutesCreate = jest.spyOn(userRoutes, "create");
const spyOnUserRoutesLogin = jest.spyOn(userRoutes, "login");

// Import middleware and router setup BEFORE spying
import { middlewares } from "../middlewares";
import { userValidationSchema } from "../validation";

// Create and spy on middleware instances BEFORE router imports them
const validateForCreate = middlewares.createValidateMiddleware({
  schema: userValidationSchema,
});

const spyOnValidateForCreate = jest.spyOn(
  validateForCreate,
  "validateMiddleware"
);

const validateForLogin = middlewares.createValidateMiddleware({
  schema: userValidationSchema,
});

const spyOnValidateForLogin = jest.spyOn(
  validateForLogin,
  "validateMiddleware"
);

// NOW import and create the router with our spied middleware instances
import { createUserRouter } from "../routes/userRouter";
const userRouter = createUserRouter(validateForCreate, validateForLogin);

import {
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";
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
  jest.clearAllMocks();
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("userRouter", () => {
  describe("userRouter.create", () => {
    test("should call validate middleware", async () => {
      const res = await request(app).post(paths.users.base).send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(spyOnValidateForCreate).toHaveBeenCalled();
      // @ts-ignore
      expect(res.res.req.path).toBe(paths.users.base);
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
      const res = await request(app)
        .post(`${paths.users.base}${paths.users.login}`)
        .send({
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD,
        });

      expect(spyOnValidateForLogin).toHaveBeenCalled();
      // @ts-ignore
      expect(res.res.req.path).toBe(`${paths.users.base}${paths.users.login}`);
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

    test("should return 400 when password is incorrect", async () => {
      await expectCreateUserRequest(app);

      const response = await request(app)
        .post(`${paths.users.base}${paths.users.login}`)
        .send({
          email: TEST_USER_EMAIL,
          password: TEST_USER_ALTERNATIVE_PASSWORD,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [ERROR_MESSAGES.USER_PASSWORD_WRONG],
      });
    });
  });
});
