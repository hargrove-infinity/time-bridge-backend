import httpMocks from "node-mocks-http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../models";
import { userRoutes } from "../routes";
import { userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./constants";
import { expectJwtPayload } from "./utils";

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
  describe("userRoutes.create", () => {
    test("should call userService.create", async () => {
      const spy = jest.spyOn(userService, "create");
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      });
      const response = httpMocks.createResponse();
      await userRoutes.create(request, response);
      expect(spy).toHaveBeenCalled();
    });

    test("should return JWT in response", async () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      });
      const response = httpMocks.createResponse();
      await userRoutes.create(request, response);

      expect(response.statusCode).toBe(200);

      const data = response._getData();

      expect(typeof data.payload).toBe("string");

      const decoded = jwt.decode(data.payload);

      expectJwtPayload(decoded);

      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
    });
  });
  describe("userRoutes.login", () => {
    test.todo("should call userService.login");

    test.todo(
      "should return a JWT token with correct payload in response when credentials are valid"
    );

    test.todo("should return a JWT token with with correct expiration time");

    test.todo("should return 200 status code on successful login");

    test.todo("should return error message when email does not exist");

    test.todo("should return 400 status code when email does not exist");

    test.todo("should return error message when password is incorrect");

    test.todo("should return 400 status code when password is incorrect");
  });
});
