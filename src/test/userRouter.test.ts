import express, { Express } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import { ERROR_DEFINITIONS, paths } from "../constants";
import { UserModel } from "../models";
import { closeConnectionDatabase, connectDatabase } from "../utils";

// Import and spy on validation middleware
import { middlewares } from "../middlewares";

const validateSpy = jest.fn();

const originalValidate = middlewares.validate;
jest.spyOn(middlewares, "validate").mockImplementation((...args) => {
  const middleware = originalValidate(...args);

  return (req, res, next) => {
    validateSpy(req, res, next);
    return middleware(req, res, next);
  };
});

// Import and spy on userRoutes
import { userRoutes } from "../routes/userRoutes";

// Create spies at module level, BEFORE userRouter is imported
const spyOnUserRoutesRegister = jest.spyOn(userRoutes, "register");
const spyOnUserRoutesLogin = jest.spyOn(userRoutes, "login");

// Import userRouter AFTER creating spies
import { userRouter } from "../routes/userRouter";

import {
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";
import { expectJwtPayload, expectRegisterRequestSuccess } from "./utils";

let app: Express;

beforeAll(async () => {
  await connectDatabase();

  app = express();
  app.use(express.json());
  app.use(userRouter);
});

afterEach(async () => {
  await UserModel.deleteMany({});
  validateSpy.mockClear();
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("userRouter", () => {
  describe("userRouter.register", () => {
    test("should call validate middleware", async () => {
      await request(app).post(paths.auth.register).send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should call userRoutes.register", async () => {
      await request(app)
        .post(paths.auth.register)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      expect(spyOnUserRoutesRegister).toHaveBeenCalled();
    });

    test("should receive 200 status code", async () => {
      const response = await request(app)
        .post(paths.auth.register)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      expect(response.status).toBe(200);
    });

    test("should respond with correct payload", async () => {
      await expectRegisterRequestSuccess();
    });
  });

  describe("userRouter.login", () => {
    test("should call validate middleware", async () => {
      await request(app).post(paths.auth.login).send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should call userRoutes.login", async () => {
      await request(app)
        .post(paths.auth.login)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });

      expect(spyOnUserRoutesLogin).toHaveBeenCalled();
    });

    test("should receive 200 status code", async () => {
      const responseRegisterUser = await request(app)
        .post(paths.auth.register)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      expect(responseRegisterUser.status).toBe(200);

      const responseLoginUser = await request(app)
        .post(paths.auth.login)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      expect(responseLoginUser.status).toBe(200);
    });

    test("should respond with correct payload", async () => {
      await expectRegisterRequestSuccess();

      const response = await request(app).post(paths.auth.login).send({
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
      const response = await request(app).post(paths.auth.login).send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [
          {
            code: ERROR_DEFINITIONS.LOGIN_FAILED.code,
            description: ERROR_DEFINITIONS.LOGIN_FAILED.description,
            data: [],
          },
        ],
      });
    });

    test("should return 400 when password is incorrect", async () => {
      await expectRegisterRequestSuccess();

      const responseLogin = await request(app).post(paths.auth.login).send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_ALTERNATIVE_PASSWORD,
      });

      expect(responseLogin.status).toBe(400);
      expect(responseLogin.body).toEqual({
        errors: [
          {
            code: ERROR_DEFINITIONS.LOGIN_FAILED.code,
            description: ERROR_DEFINITIONS.LOGIN_FAILED.description,
            data: [],
          },
        ],
      });
    });
  });
});
