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
const spyOnUserRoutesResendCode = jest.spyOn(userRoutes, "resendCode");
const spyOnUserRoutesEmailConfirm = jest.spyOn(userRoutes, "emailConfirm");
const spyOnUserRoutesLogin = jest.spyOn(userRoutes, "login");

// Import userRouter AFTER creating spies
import { userRouter } from "../routes/userRouter";

import {
  TEST_EMAIL_CONFIRMATION_CODE,
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";
import {
  expectEmailConfirmRepoFindOneSuccess,
  expectJwtPayload,
  expectUserRepoFindOneSuccess,
  expectUserRequestRegisterSuccess,
} from "./utils";

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
    test("should call validate middleware on userRouter.register", async () => {
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

    test("should receive 200 status code from userRoutes.register", async () => {
      const response = await request(app)
        .post(paths.auth.register)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });

      expect(response.status).toBe(200);
    });

    test("should respond with correct payload from userRoutes.register", async () => {
      await expectUserRequestRegisterSuccess();
    });
  });

  describe("userRouter.emailConfirm", () => {
    test("should call validate middleware on userRouter.emailConfirm", async () => {
      await request(app)
        .post(paths.auth.emailConfirm)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });

      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should call userRoutes.emailConfirm", async () => {
      await request(app)
        .post(paths.auth.emailConfirm)
        .send({ email: TEST_USER_EMAIL, code: TEST_EMAIL_CONFIRMATION_CODE });

      expect(spyOnUserRoutesEmailConfirm).toHaveBeenCalled();
    });

    test("should receive 200 status code from userRouter.emailConfirm", async () => {
      await expectUserRequestRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      const response = await request(app)
        .post(paths.auth.emailConfirm)
        .send({ email: TEST_USER_EMAIL, code: emailConfirmDocument.code });

      expect(response.status).toBe(200);
    });

    test("should respond with correct payload from userRouter.emailConfirm", async () => {
      await expectUserRequestRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      const response = await request(app).post(paths.auth.emailConfirm).send({
        email: TEST_USER_EMAIL,
        code: emailConfirmDocument.code,
      });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ payload: expect.any(String) });

      const decoded = jwt.decode(response.body.payload);

      expectJwtPayload(decoded);

      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
    });
  });

  describe("userRouter.resendCode", () => {
    test("should call validate middleware on userRouter.resendCode", async () => {
      await request(app)
        .post(paths.auth.resendCode)
        .send({ email: TEST_USER_EMAIL });

      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should call userRoutes.resendCode", async () => {
      await request(app)
        .post(paths.auth.resendCode)
        .send({ email: TEST_USER_EMAIL });
      expect(spyOnUserRoutesResendCode).toHaveBeenCalled();
    });

    test.todo("should receive 200 status code from userRouter.resendCode");

    test.todo("should respond with correct payload from userRouter.resendCode");
  });

  describe("userRouter.login", () => {
    test("should call validate middleware on userRouter.login", async () => {
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

    test("should receive 200 status code from userRouter.login", async () => {
      const responseRegisterUser = await request(app)
        .post(paths.auth.register)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      expect(responseRegisterUser.status).toBe(200);

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      const responseEmailConfirm = await request(app)
        .post(paths.auth.emailConfirm)
        .send({ email: TEST_USER_EMAIL, code: emailConfirmDocument.code });
      expect(responseEmailConfirm.status).toBe(200);

      const responseLoginUser = await request(app)
        .post(paths.auth.login)
        .send({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
      expect(responseLoginUser.status).toBe(200);
    });

    test("should respond with correct payload from userRoutes.login", async () => {
      await expectUserRequestRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      const responseEmailConfirm = await request(app)
        .post(paths.auth.emailConfirm)
        .send({
          email: TEST_USER_EMAIL,
          code: emailConfirmDocument.code,
        });
      expect(responseEmailConfirm.status).toBe(200);

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

    test("should return 400 when email does not exist from userRoutes.login", async () => {
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

    test("should return 400 when password is incorrect from userRoutes.login", async () => {
      await expectUserRequestRegisterSuccess();

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
