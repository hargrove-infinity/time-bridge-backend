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
});
