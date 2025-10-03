import httpMocks from "node-mocks-http";
import { ERROR_MESSAGES } from "../constants";
import { validate } from "../middlewares";
import { userValidationSchema } from "../validation";

describe("validate middleware", () => {
  test("should fail: body is empty object", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = validate({ schema: userValidationSchema });
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
      body: { email: "", password: "password" },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = validate({ schema: userValidationSchema });
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
      body: { email: "abc", password: "password" },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = validate({ schema: userValidationSchema });
    middleware(request, response, next);

    expect(response.statusCode).toBe(400);

    const data = response._getData();

    expect(data.errors).toEqual([ERROR_MESSAGES.EMAIL_INVALID]);
  });

  test("should fail: email is valid, password is undefined", async () => {
    const request = httpMocks.createRequest({
      body: { email: "mail@mail.com", password: undefined },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = validate({ schema: userValidationSchema });
    middleware(request, response, next);

    expect(response.statusCode).toBe(400);

    const data = response._getData();

    expect(data.errors).toEqual([ERROR_MESSAGES.PASSWORD_UNDEFINED]);
  });

  test("should fail: email is valid, password is invalid", async () => {
    const request = httpMocks.createRequest({
      body: { email: "mail@mail.com", password: "pass" },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const middleware = validate({ schema: userValidationSchema });
    middleware(request, response, next);

    expect(response.statusCode).toBe(400);

    const data = response._getData();

    expect(data.errors).toEqual([ERROR_MESSAGES.PASSWORD_LENGTH]);
  });
});
