import httpMocks from "node-mocks-http";
import { ERROR_DEFINITIONS } from "../constants";
import { middlewares } from "../middlewares";
import {
  emailConfirmValidationSchema,
  emailValidationSchema,
  userValidationSchema,
} from "../validation";
import {
  TEST_EMAIL_CONFIRMATION_CODE,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";

describe("validate middleware", () => {
  describe("userValidationSchema", () => {
    test("should fail: body is empty object", () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const next = jest.fn();

      const middleware = middlewares.validate({ schema: userValidationSchema });
      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: [],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
        {
          code: ERROR_DEFINITIONS.PASSWORD_NOT_STRING.code,
          data: [],
          description: ERROR_DEFINITIONS.PASSWORD_NOT_STRING.description,
        },
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
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: [],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);

      expect(next).not.toHaveBeenCalled();
    });

    test("should fail: email is invalid, password is valid", () => {
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

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: ["abc"],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should fail: email is valid, password is undefined", () => {
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

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.PASSWORD_NOT_STRING.code,
          data: [],
          description: ERROR_DEFINITIONS.PASSWORD_NOT_STRING.description,
        },
      ]);
    });

    test("should fail: email is valid, password is invalid", () => {
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

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.PASSWORD_MIN_LEN_FAILED.code,
          data: ["pass"],
          description: ERROR_DEFINITIONS.PASSWORD_MIN_LEN_FAILED.description,
        },
        {
          code: ERROR_DEFINITIONS.PASSWORD_REQUIREMENTS_NOT_MET.code,
          data: ["pass"],
          description:
            ERROR_DEFINITIONS.PASSWORD_REQUIREMENTS_NOT_MET.description,
        },
      ]);
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

  describe("emailConfirmValidationSchema", () => {
    test("should fail: email is valid, code is undefined", () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: undefined },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_NOT_STRING.code,
          data: [],
          description:
            ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_NOT_STRING.description,
        },
      ]);
    });

    test("should fail: email is valid, code is null", () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: null },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_NOT_STRING.code,
          data: [],
          description:
            ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_NOT_STRING.description,
        },
      ]);
    });

    test("should fail: email is valid, code is empty string", () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: "" },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_MUST_BE_6_DIGITS.code,
          data: [],
          description:
            ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_MUST_BE_6_DIGITS.description,
        },
      ]);
    });

    test("should fail: email is valid, code is random string", () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: "abc123" },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_MUST_BE_6_DIGITS.code,
          data: ["abc123"],
          description:
            ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_MUST_BE_6_DIGITS.description,
        },
      ]);
    });

    test("should fail: email is valid, code is 5-digit string", () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: "31456" },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_MUST_BE_6_DIGITS.code,
          data: ["31456"],
          description:
            ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_MUST_BE_6_DIGITS.description,
        },
      ]);
    });

    test("should fail: email is undefined, code is valid", () => {
      const request = httpMocks.createRequest({
        body: { email: undefined, code: TEST_EMAIL_CONFIRMATION_CODE },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: [],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should fail: email is null, code is valid", () => {
      const request = httpMocks.createRequest({
        body: { email: null, code: TEST_EMAIL_CONFIRMATION_CODE },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: [],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should fail: email is empty string, code is valid", () => {
      const request = httpMocks.createRequest({
        body: { email: "", code: TEST_EMAIL_CONFIRMATION_CODE },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: [],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should fail: email is random string, code is valid", () => {
      const request = httpMocks.createRequest({
        body: { email: "abc", code: TEST_EMAIL_CONFIRMATION_CODE },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: ["abc"],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should pass: email and code are valid", () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL, code: TEST_EMAIL_CONFIRMATION_CODE },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailConfirmValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(200);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("emailValidationSchema", () => {
    test("should fail: email is undefined", () => {
      const request = httpMocks.createRequest({
        body: { email: undefined },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: [],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should fail: email is null", () => {
      const request = httpMocks.createRequest({ body: { email: null } });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: [],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should fail: email is empty string", () => {
      const request = httpMocks.createRequest({
        body: { email: "" },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: [],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should fail: email is random string", () => {
      const request = httpMocks.createRequest({
        body: { email: "abc" },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(400);

      const data = response._getData();

      expect(data.errors).toEqual([
        {
          code: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code,
          data: ["abc"],
          description: ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.description,
        },
      ]);
    });

    test("should pass: email is valid", () => {
      const request = httpMocks.createRequest({
        body: { email: TEST_USER_EMAIL },
      });

      const response = httpMocks.createResponse();

      const next = jest.fn();

      const middleware = middlewares.validate({
        schema: emailValidationSchema,
      });

      middleware(request, response, next);

      expect(response.statusCode).toBe(200);

      expect(next).toHaveBeenCalled();
    });
  });
});
