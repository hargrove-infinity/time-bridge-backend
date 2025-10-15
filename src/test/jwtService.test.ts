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
