import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constants";
import { jwtService } from "../services";
import {
  TEST_USER_EMAIL,
  TEST_USER_ID_STRING,
  TOKEN_EXPIRED_DELAY,
} from "./constants";
import { signAndVerifyTestJwt, signTestJwt, sleep } from "./utils";

describe("jwtService", () => {
  describe("jwtService.sign", () => {
    test("should return valid tuple [JWT token, null] when provided with valid arguments", () => {
      const [token] = signAndVerifyTestJwt();
      const decoded = jwt.decode(token!);

      expect(decoded).toStrictEqual({
        _id: TEST_USER_ID_STRING,
        email: TEST_USER_EMAIL,
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
    });

    test("should use HS256 algorithm for signing", () => {
      const [token] = signAndVerifyTestJwt();
      const decoded = jwt.decode(token!, { complete: true });
      expect(decoded?.header.alg).toBe("HS256");
    });

    test("should use correct expiresIn for signing", () => {
      const [token] = signAndVerifyTestJwt();
      const decoded = jwt.decode(token!, { json: true });

      expect(typeof decoded?.iat).toBe("number");
      expect(typeof decoded?.exp).toBe("number");

      const expiresInHrs = (decoded?.exp! - decoded?.iat!) / 3600;
      expect(expiresInHrs).toBe(3);
    });

    test("should return error when expiresIn is negative number", () => {
      const [token, errorSign] = signTestJwt({ options: { expiresIn: "-1h" } });

      expect(token).toBeNull();

      expect(errorSign).toEqual({
        errors: [ERROR_MESSAGES.EXPIRES_IN_NEGATIVE],
      });
    });

    test("should return error when expiresIn number is less than 1", () => {
      const [token, errorSign] = signTestJwt({ options: { expiresIn: 0.5 } });

      expect(token).toBeNull();

      expect(errorSign).toEqual({
        errors: [ERROR_MESSAGES.EXPIRES_IN_LESS_THAN_ONE],
      });
    });

    test("should return error when payload is null", () => {
      const [token, errorSign] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: null instead of correct payload
        payload: null,
        options: { expiresIn: "1h" },
      });

      expect(token).toBeNull();

      expect(errorSign).toEqual({
        errors: [ERROR_MESSAGES.INVALID_PAYLOAD_SIGN_IN_TOKEN],
      });
    });

    test("should return error when payload is undefined", () => {
      const [token, errorSign] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: undefined instead of correct payload
        payload: undefined,
        options: { expiresIn: "1h" },
      });

      expect(token).toBeNull();

      expect(errorSign).toEqual({
        errors: [ERROR_MESSAGES.INVALID_PAYLOAD_SIGN_IN_TOKEN],
      });
    });

    test("should return error when payload is missing required fields", () => {
      const [token, errorSign] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: { payload: {id: 1} } instead of correct payload
        payload: { id: 1 },
        options: { expiresIn: "1h" },
      });

      expect(token).toBeNull();

      expect(errorSign).toEqual({
        errors: [ERROR_MESSAGES.INVALID_PAYLOAD_SIGN_IN_TOKEN],
      });
    });

    test("should return error when expiresIn is null", () => {
      const [token, errorSign] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: null instead of correct expiresIn
        options: { expiresIn: null },
      });

      expect(token).toBeNull();

      expect(errorSign).toEqual({ errors: [ERROR_MESSAGES.EXPIRES_IN_NULL] });
    });

    test("should return error when expiresIn is undefined", () => {
      const [token, errorSign] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: undefined instead of correct expiresIn
        options: { expiresIn: undefined },
      });

      expect(token).toBeNull();

      expect(errorSign).toEqual({
        errors: [ERROR_MESSAGES.EXPIRES_IN_UNDEFINED],
      });
    });

    test("should return error when expiresIn is invalid format", () => {
      const [token, errorSign] = jwtService.sign({
        // @ts-expect-error - Testing invalid input: "abc" instead of correct expiresIn
        options: { expiresIn: "abc" },
      });

      expect(token).toBeNull();

      expect(errorSign).toEqual({
        errors: [ERROR_MESSAGES.EXPIRES_IN_WRONG_FORMAT],
      });
    });

    test("should return error when algorithm is invalid format", () => {
      // @ts-expect-error - Testing invalid input: "abc" instead of correct algorithm
      const [token, errorSign] = signTestJwt({ options: { algorithm: "abc" } });

      expect(token).toBeNull();

      expect(errorSign).toEqual({
        errors: [ERROR_MESSAGES.ERROR_TOKEN_SIGNATURE_ALGORITHM],
      });
    });
  });

  describe("jwtService.verify", () => {
    test("should return valid tuple [JWTPayload, null] when provided with valid arguments", () => {
      const [token] = signAndVerifyTestJwt();

      const [verifyResult, errorVerify] = jwtService.verify({ token: token! });

      expect(verifyResult).toBeDefined();
      expect(verifyResult).not.toBeNull();

      expect(typeof verifyResult).not.toBe("string");
      expect(typeof verifyResult).toBe("object");

      expect(verifyResult).toStrictEqual({
        _id: TEST_USER_ID_STRING,
        email: TEST_USER_EMAIL,
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
      const [token] = signAndVerifyTestJwt({ options: { expiresIn: "1ms" } });

      await sleep(TOKEN_EXPIRED_DELAY);

      const [verifyResult, errorVerify] = jwtService.verify({ token: token! });

      expect(verifyResult).toBeNull();

      expect(errorVerify).toEqual({ errors: [ERROR_MESSAGES.TOKEN_EXPIRED] });
    });
  });
});
