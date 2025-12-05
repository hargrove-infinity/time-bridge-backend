import httpMocks from "node-mocks-http";
import {
  DEFAULT_EXPIRES_IN_TOKEN_NUMBER,
  EMAIL_CONFIRMATION_STEP,
  ERROR_DEFINITIONS,
  ONE_HOUR_IN_SECONDS,
} from "../constants";
import { UserModel } from "../models";
import { userRoutes } from "../routes";
import { userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import {
  TEST_EMAIL_CONFIRMATION_CODE,
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";
import {
  expectEmailConfirmRepoFindOneSuccess,
  expectUserRepoFindOneSuccess,
  expectUserRouteEmailConfirmSuccess,
  expectUserRouteLoginSuccess,
  expectUserRouteRegisterSuccess,
} from "./utils";

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("userRoutes", () => {
  describe("userRoutes.register", () => {
    test("should call userService.register", async () => {
      const spy = jest.spyOn(userService, "register");
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      });
      const response = httpMocks.createResponse();
      await userRoutes.register(request, response);
      expect(spy).toHaveBeenCalled();
    });

    test("should return correct payload in response", async () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      });
      const response = httpMocks.createResponse();
      await userRoutes.register(request, response);

      expect(response.statusCode).toBe(200);

      const data = response._getData();

      expect(data.payload).toEqual({ nextStep: EMAIL_CONFIRMATION_STEP });
    });
  });

  describe("userRoutes.emailConfirm", () => {
    test("should call userService.emailConfirm", async () => {
      const spy = jest.spyOn(userService, "emailConfirm");
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: TEST_EMAIL_CONFIRMATION_CODE },
      });
      const response = httpMocks.createResponse();
      await userRoutes.emailConfirm(request, response);
      expect(spy).toHaveBeenCalled();
    });

    test("should return a JWT token with correct payload", async () => {
      await expectUserRouteRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      await expectUserRouteEmailConfirmSuccess(emailConfirmDocument.code);
    });

    test("should return a JWT token with with correct expiration time", async () => {
      await expectUserRouteRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      const decodedJwt = await expectUserRouteEmailConfirmSuccess(
        emailConfirmDocument.code
      );

      const expiresInHrs =
        (decodedJwt.exp - decodedJwt.iat) / ONE_HOUR_IN_SECONDS;
      expect(expiresInHrs).toBe(DEFAULT_EXPIRES_IN_TOKEN_NUMBER);
    });

    test("should return error message when email does not exist", async () => {
      const requestEmailConfirm = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: TEST_EMAIL_CONFIRMATION_CODE },
      });
      const responseEmailConfirm = httpMocks.createResponse();
      await userRoutes.emailConfirm(requestEmailConfirm, responseEmailConfirm);

      expect(responseEmailConfirm.statusCode).toBe(400);

      const dataEmailConfirm = responseEmailConfirm._getData();

      expect(dataEmailConfirm).toEqual({
        errors: [
          {
            code: ERROR_DEFINITIONS.EMAIL_CONFIRMATION_FAILED.code,
            description:
              ERROR_DEFINITIONS.EMAIL_CONFIRMATION_FAILED.description,
            data: [],
          },
        ],
      });
    });

    test("should return error message when code is incorrect", async () => {
      await expectUserRouteRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      const wrongCode = (parseInt(emailConfirmDocument.code) + 1)
        .toString()
        .padStart(6, "0");

      const requestEmailConfirm = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: wrongCode },
      });
      const responseEmailConfirm = httpMocks.createResponse();
      await userRoutes.emailConfirm(requestEmailConfirm, responseEmailConfirm);

      expect(responseEmailConfirm.statusCode).toBe(400);

      const dataEmailConfirm = responseEmailConfirm._getData();

      expect(dataEmailConfirm).toEqual({
        errors: [
          {
            code: ERROR_DEFINITIONS.EMAIL_CONFIRMATION_FAILED.code,
            description:
              ERROR_DEFINITIONS.EMAIL_CONFIRMATION_FAILED.description,
            data: [],
          },
        ],
      });
    });
  });

  describe("userRoutes.login", () => {
    test("should call userService.login", async () => {
      const spy = jest.spyOn(userService, "login");
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      });
      const response = httpMocks.createResponse();
      await userRoutes.login(request, response);
      expect(spy).toHaveBeenCalled();
    });

    test("should return a JWT token with correct payload", async () => {
      await expectUserRouteRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      await expectUserRouteEmailConfirmSuccess(emailConfirmDocument.code);

      await expectUserRouteLoginSuccess();
    });

    test("should return a JWT token with with correct expiration time", async () => {
      await expectUserRouteRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocument = await expectEmailConfirmRepoFindOneSuccess({
        user: userInDb._id,
      });

      await expectUserRouteEmailConfirmSuccess(emailConfirmDocument.code);

      const decodedJwt = await expectUserRouteLoginSuccess();

      const expiresInHrs =
        (decodedJwt.exp - decodedJwt.iat) / ONE_HOUR_IN_SECONDS;
      expect(expiresInHrs).toBe(DEFAULT_EXPIRES_IN_TOKEN_NUMBER);
    });

    test("should return error message when email does not exist", async () => {
      const requestLoginUser = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      });
      const responseLoginUser = httpMocks.createResponse();
      await userRoutes.login(requestLoginUser, responseLoginUser);

      expect(responseLoginUser.statusCode).toBe(400);

      const dataLoginUser = responseLoginUser._getData();

      expect(dataLoginUser).toEqual({
        errors: [
          {
            code: ERROR_DEFINITIONS.LOGIN_FAILED.code,
            description: ERROR_DEFINITIONS.LOGIN_FAILED.description,
            data: [],
          },
        ],
      });
    });

    test("should return error message when password is incorrect", async () => {
      await expectUserRouteRegisterSuccess();

      const requestLoginUser = httpMocks.createRequest({
        body: {
          email: TEST_USER_EMAIL,
          password: TEST_USER_ALTERNATIVE_PASSWORD,
        },
      });
      const responseLoginUser = httpMocks.createResponse();
      await userRoutes.login(requestLoginUser, responseLoginUser);

      expect(responseLoginUser.statusCode).toBe(400);

      const dataLoginUser = responseLoginUser._getData();

      expect(dataLoginUser).toEqual({
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
