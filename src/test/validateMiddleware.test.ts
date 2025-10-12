import httpMocks from "node-mocks-http";
import { ERROR_MESSAGES } from "../constants";
import { middlewares } from "../middlewares";
import { userValidationSchema } from "../validation";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./constants";

describe("validate middleware", () => {
  test("should fail: body is empty object", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = middlewares.validate({ schema: userValidationSchema });
    middleware(request, response, next);

    expect(response.statusCode).toBe(400);

    const data = response._getData();

    expect(data.errors).toEqual([
      ERROR_MESSAGES.EMAIL_UNDEFINED,
      ERROR_MESSAGES.PASSWORD_UNDEFINED,
    ]);

    expect(next).not.toHaveBeenCalled();
  });

  test("should fail: email is empty and invalid, password is valid", () => {
    const request = httpMocks.createRequest({
      body: { email: "", password: TEST_USER_PASSWORD },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = middlewares.validate({
      schema: userValidationSchema,
    });
    middleware(request, response, next);

    expect(response.statusCode).toBe(400);

    const data = response._getData();

    expect(data.errors).toEqual([
      ERROR_MESSAGES.EMAIL_EMPTY,
      ERROR_MESSAGES.EMAIL_INVALID,
    ]);

    expect(next).not.toHaveBeenCalled();
  });

  test("should fail: email is invalid, password is valid", async () => {
    const request = httpMocks.createRequest({
      body: { email: "abc", password: TEST_USER_PASSWORD },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = middlewares.validate({
      schema: userValidationSchema,
    });
    middleware(request, response, next);

    expect(response.statusCode).toBe(400);

    const data = response._getData();

    expect(data.errors).toEqual([ERROR_MESSAGES.EMAIL_INVALID]);
  });

  test("should fail: email is valid, password is undefined", async () => {
    const request = httpMocks.createRequest({
      body: { email: TEST_USER_EMAIL, password: undefined },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = middlewares.validate({
      schema: userValidationSchema,
    });
    middleware(request, response, next);

    expect(response.statusCode).toBe(400);

    const data = response._getData();

    expect(data.errors).toEqual([ERROR_MESSAGES.PASSWORD_UNDEFINED]);
  });

  test("should fail: email is valid, password is invalid", async () => {
    const request = httpMocks.createRequest({
      body: { email: TEST_USER_EMAIL, password: "pass" },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = middlewares.validate({
      schema: userValidationSchema,
    });
    middleware(request, response, next);

    expect(response.statusCode).toBe(400);

    const data = response._getData();

    expect(data.errors).toEqual([ERROR_MESSAGES.PASSWORD_LENGTH]);
  });

  test("should pass: email and password are valid", () => {
    const request = httpMocks.createRequest({
      body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = middlewares.validate({
      schema: userValidationSchema,
    });
    middleware(request, response, next);

    expect(response.statusCode).toBe(200);
    expect(next).toHaveBeenCalled();
  });
});
