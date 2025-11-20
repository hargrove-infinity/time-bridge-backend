import { ERROR_DEFINITIONS } from "../constants";
import { ApplicationError } from "../errors";
import { bcryptService } from "../services";
import {
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_PASSWORD,
} from "./constants";
import {
  expectBcryptCompareResult,
  expectBcryptCorrectHashResult,
} from "./utils";

describe("bcryptService", () => {
  describe("bcryptService.hash", () => {
    test("should successfully hash a password with default rounds", async () => {
      const result = await bcryptService.hash({ data: TEST_USER_PASSWORD });
      expectBcryptCorrectHashResult(result);
    });

    test("should successfully hash a password with custom rounds", async () => {
      const result = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
        saltOrRounds: 12,
      });

      expectBcryptCorrectHashResult(result);
    });

    test("should return error when salt is a random string", async () => {
      const [hash, error] = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
        saltOrRounds: "abc",
      });

      expect(hash).toBeNull();

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error?.errorCode).toBe(
        ERROR_DEFINITIONS.INVALID_SALT_HASHING_STRING.code
      );
    });

    test("should return error when rounds is negative number", async () => {
      const [hash, error] = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
        saltOrRounds: -1,
      });

      expect(hash).toBeNull();

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error?.errorCode).toBe(ERROR_DEFINITIONS.ROUNDS_NEGATIVE.code);
    });

    test("should return error when rounds is less than one", async () => {
      const [hash, error] = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
        saltOrRounds: 0,
      });

      expect(hash).toBeNull();

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error?.errorCode).toBe(
        ERROR_DEFINITIONS.ROUNDS_LESS_THAN_ONE.code
      );
    });
  });

  describe("bcryptService.compare", () => {
    test("should return true when password matches the hash", async () => {
      const resultHashing = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
      });

      expectBcryptCorrectHashResult(resultHashing);

      const [hash] = resultHashing;

      const resultComparing = await bcryptService.compare({
        data: TEST_USER_PASSWORD,
        encrypted: hash,
      });

      expectBcryptCompareResult({ data: resultComparing, result: true });
    });

    test("should return false when password does not match the hash", async () => {
      const resultHashing = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
      });

      expectBcryptCorrectHashResult(resultHashing);

      const [hash] = resultHashing;

      const resultComparing = await bcryptService.compare({
        data: TEST_USER_ALTERNATIVE_PASSWORD,
        encrypted: hash,
      });

      expectBcryptCompareResult({ data: resultComparing, result: false });
    });

    test("should return false when comparing valid string with empty hash", async () => {
      const resultComparing = await bcryptService.compare({
        data: TEST_USER_PASSWORD,
        encrypted: "",
      });

      expectBcryptCompareResult({ data: resultComparing, result: false });
    });

    test("should return false when comparing empty string with valid hash", async () => {
      const resultHashing = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
      });

      expectBcryptCorrectHashResult(resultHashing);
      const [hash] = resultHashing;

      const resultComparing = await bcryptService.compare({
        data: "",
        encrypted: hash,
      });

      expectBcryptCompareResult({ data: resultComparing, result: false });
    });

    test("should return false when data and hash arguments are swapped", async () => {
      const resultHashing = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
      });

      expectBcryptCorrectHashResult(resultHashing);
      const [hash] = resultHashing;

      const resultComparing = await bcryptService.compare({
        data: hash,
        encrypted: TEST_USER_PASSWORD,
      });

      expectBcryptCompareResult({ data: resultComparing, result: false });
    });
  });
});
