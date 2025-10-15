import httpMocks from "node-mocks-http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../models";
import { userRoutes } from "../routes";
import { userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./constants";

function expectToEqualJwtPayload(data: unknown): asserts data is {
  _id: string;
  email: string;
  iat: number;
  exp: number;
} {
  expect(data).toStrictEqual({
    _id: expect.any(String),
    email: TEST_USER_EMAIL,
    iat: expect.any(Number),
    exp: expect.any(Number),
  });
}

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await closeConnectionDatabase();
});

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

    const decoded = jwt.decode(data.payload!);

    expectToEqualJwtPayload(decoded);

    expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
  });
});
