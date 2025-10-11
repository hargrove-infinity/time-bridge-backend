import jwt from "jsonwebtoken";
import { jwtService } from "../services";
import { ERROR_MESSAGES } from "../constants";

describe("jwtService", () => {
  describe("jwtService.sign", () => {
    test("should return valid tuple [JWT token, null] when provided with valid arguments", () => {
      const payload = { email: "mail@mail.com" };

      const [data, error] = jwtService.sign({
        payload,
        options: { algorithm: "HS256", expiresIn: "3h" },
      });

      expect(data).toBeDefined();
      expect(data).not.toBeNull();
      expect(typeof data).toBe("string");
      expect(error).toBe(null);

      const decoded = jwt.decode(data!);
      expect(decoded).toMatchObject(payload);
    });

    test("should use HS256 algorithm for signing", () => {
      const payload = { email: "mail@mail.com" };

      const [data, error] = jwtService.sign({
        payload,
        options: { algorithm: "HS256", expiresIn: "3h" },
      });

      expect(data).toBeDefined();
      expect(data).not.toBeNull();
      expect(typeof data).toBe("string");
      expect(error).toBe(null);

      const decoded = jwt.decode(data!, { complete: true });
      expect(decoded?.header.alg).toBe("HS256");
    });

    test("should use correct expiresIn for signing", () => {
      const payload = { email: "mail@mail.com" };

      const [data, error] = jwtService.sign({
        payload,
        options: {
          algorithm: "HS256",
          expiresIn: "3h",
        },
      });

      expect(data).toBeDefined();
      expect(data).not.toBeNull();
      expect(typeof data).toBe("string");
      expect(error).toBe(null);

      const decoded = jwt.decode(data!, { json: true });

      expect(typeof decoded?.iat).toBe("number");
      expect(typeof decoded?.exp).toBe("number");

      const expiresInHrs = (decoded?.exp! - decoded?.iat!) / 3600;
      expect(expiresInHrs).toBe(3);
    });

    test("should return error when expiresIn is negative number", () => {
      const payload = { email: "mail@mail.com" };

      const [data, error] = jwtService.sign({
        payload,
        options: {
          algorithm: "HS256",
          expiresIn: "-1h",
        },
      });

      expect(data).toBeNull();

      expect(error).toEqual({
        errors: [ERROR_MESSAGES.EXPIRES_IN_NEGATIVE],
      });
    });

    test("should return error when expiresIn number is less than 1", () => {
      const payload = { email: "mail@mail.com" };

      const [data, error] = jwtService.sign({
        payload,
        options: {
          algorithm: "HS256",
          expiresIn: 0.5,
        },
      });

      expect(data).toBeNull();

      expect(error).toEqual({
        errors: [ERROR_MESSAGES.EXPIRES_IN_LESS_THAN_ONE],
      });
    });

    test("should return error when payload is null", () => {
      const [data, error] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: null instead of correct payload
        payload: null,
        options: { expiresIn: "1h" },
      });

      expect(data).toBeNull();

      expect(error).toEqual({
        errors: [ERROR_MESSAGES.INVALID_PAYLOAD_SIGN_IN_TOKEN],
      });
    });

    test("should return error when payload is undefined", () => {
      const [data, error] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: undefined instead of correct payload
        payload: undefined,
        options: { expiresIn: "1h" },
      });

      expect(data).toBeNull();

      expect(error).toEqual({
        errors: [ERROR_MESSAGES.INVALID_PAYLOAD_SIGN_IN_TOKEN],
      });
    });

    test("should return error when payload is missing required fields", () => {
      const [data, error] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: { payload: {id: 1} } instead of correct payload
        payload: { id: 1 },
        options: { expiresIn: "1h" },
      });

      expect(data).toBeNull();

      expect(error).toEqual({
        errors: [ERROR_MESSAGES.INVALID_PAYLOAD_SIGN_IN_TOKEN],
      });
    });

    test("should return error when expiresIn is null", () => {
      // @ts-expect-error - Testing invalid input: null instead of correct expiresIn
      const [data, error] = jwtService.sign({ options: { expiresIn: null } });

      expect(data).toBeNull();

      expect(error).toEqual({ errors: [ERROR_MESSAGES.EXPIRES_IN_NULL] });
    });

    test("should return error when expiresIn is undefined", () => {
      const [data, error] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: undefined instead of correct expiresIn
        options: { expiresIn: undefined },
      });

      expect(data).toBeNull();

      expect(error).toEqual({ errors: [ERROR_MESSAGES.EXPIRES_IN_UNDEFINED] });
    });

    test("should return error when expiresIn is invalid format", () => {
      const [data, error] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: "abc" instead of correct expiresIn
        options: { expiresIn: "abc" },
      });

      expect(data).toBeNull();

      expect(error).toEqual({
        errors: [ERROR_MESSAGES.EXPIRES_IN_WRONG_FORMAT],
      });
    });

    test("should return error when algorithm is invalid format", () => {
      const payload = { email: "mail@mail.com" };

      const [data, error] = jwtService.sign({
        payload,
        options: {
          // @ts-expect-error - Testing invalid input: "abc" instead of correct algorithm
          algorithm: "abc",
          expiresIn: "3h",
        },
      });

      expect(data).toBeNull();

      expect(error).toEqual({
        errors: [ERROR_MESSAGES.ERROR_TOKEN_SIGNATURE_ALGORITHM],
      });
    });
  });

  describe("jwtService.verify", () => {
    test("should return valid tuple [JWTPayload, null] when provided with valid arguments", () => {
      const payload = { email: "mail@mail.com" };

      const [token, errorSign] = jwtService.sign({
        payload,
        options: { algorithm: "HS256", expiresIn: "3h" },
      });

      expect(token).toBeDefined();
      expect(token).not.toBeNull();
      expect(typeof token).toBe("string");
      expect(errorSign).toBe(null);

      const [verifyResult, errorVerify] = jwtService.verify({ token: token! });

      expect(verifyResult).toBeDefined();
      expect(verifyResult).not.toBeNull();

      expect(typeof verifyResult).not.toBe("string");
      expect(typeof verifyResult).toBe("object");

      expect(verifyResult).toMatchObject({
        email: "mail@mail.com",
        iat: expect.any(Number),
        exp: expect.any(Number),
      });

      expect(errorVerify).toBe(null);
    });

    test("should return error when token is null", () => {
      // @ts-expect-error - Testing invalid input: null instead of string
      const [data, error] = jwtService.verify({ token: null });

      expect(data).toBeNull();
      expect(error).toEqual({ errors: [ERROR_MESSAGES.ERROR_VERIFYING_TOKEN] });
    });

    test("should return error when token is undefined", () => {
      // @ts-expect-error - Testing invalid input: null instead of string
      const [data, error] = jwtService.verify({ token: undefined });

      expect(data).toBeNull();
      expect(error).toEqual({ errors: [ERROR_MESSAGES.ERROR_VERIFYING_TOKEN] });
    });

    test("should return error when token is empty string", () => {
      const [data, error] = jwtService.verify({ token: "" });

      expect(data).toBeNull();
      expect(error).toEqual({ errors: [ERROR_MESSAGES.ERROR_VERIFYING_TOKEN] });
    });

    test("should return error when token is blank string", () => {
      const [data, error] = jwtService.verify({ token: " " });

      expect(data).toBeNull();
      expect(error).toEqual({ errors: [ERROR_MESSAGES.ERROR_VERIFYING_TOKEN] });
    });

    test("should return error when token is random string", () => {
      const [data, error] = jwtService.verify({ token: "abc" });

      expect(data).toBeNull();
      expect(error).toEqual({ errors: [ERROR_MESSAGES.ERROR_VERIFYING_TOKEN] });
    });

    test("should return error when token is expired", async () => {
      const payload = { email: "mail@mail.com" };

      const [token, errorSign] = jwtService.sign({
        payload,
        options: {
          algorithm: "HS256",
          expiresIn: "1ms",
        },
      });

      expect(token).toBeDefined();
      expect(token).not.toBeNull();
      expect(typeof token).toBe("string");
      expect(errorSign).toBe(null);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const [verifyResult, errorVerify] = jwtService.verify({ token: token! });

      expect(verifyResult).toBeNull();

      expect(errorVerify).toEqual({ errors: [ERROR_MESSAGES.TOKEN_EXPIRED] });
    });
  });
});
