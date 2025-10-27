import httpMocks from "node-mocks-http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  DEFAULT_EXPIRES_IN_TOKEN_NUMBER,
  ERROR_MESSAGES,
  ONE_HOUR_IN_SECONDS,
} from "../constants";
import { UserModel } from "../models";
import { userRoutes } from "../routes";
import { userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import {
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";
import {
  expectJwtPayload,
  expectCreateUserRouteReturnsValidJwt,
  expectLoginUserRouteReturnsValidJwt,
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

    test("should return JWT in response", async () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      });
      const response = httpMocks.createResponse();
      await userRoutes.register(request, response);

      expect(response.statusCode).toBe(200);

      const data = response._getData();

      expect(typeof data.payload).toBe("string");

      const decoded = jwt.decode(data.payload);

      expectJwtPayload(decoded);

      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
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
      await expectCreateUserRouteReturnsValidJwt();
      await expectLoginUserRouteReturnsValidJwt();
    });

    test("should return a JWT token with with correct expiration time", async () => {
      await expectCreateUserRouteReturnsValidJwt();

      const decodedJwt = await expectLoginUserRouteReturnsValidJwt();

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
        errors: [ERROR_MESSAGES.USER_EMAIL_NOT_EXIST],
      });
    });

    test("should return error message when password is incorrect", async () => {
      await expectCreateUserRouteReturnsValidJwt();

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
        errors: [ERROR_MESSAGES.USER_PASSWORD_WRONG],
      });
    });
  });
});
