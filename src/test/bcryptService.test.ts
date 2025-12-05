import { ERROR_DEFINITIONS } from "../constants";
import { ApplicationError } from "../errors";
import { bcryptService } from "../services";
import {
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_PASSWORD,
} from "./constants";
import {
  expectBcryptServiceCompareAnyResult,
  expectBcryptServiceHashSuccess,
} from "./utils";

describe("bcryptService", () => {
  describe("bcryptService.hash", () => {
    test("should successfully hash a password with default rounds", async () => {
      const result = await bcryptService.hash({ data: TEST_USER_PASSWORD });
      expectBcryptServiceHashSuccess(result);
    });

    test("should successfully hash a password with custom rounds", async () => {
      const result = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
        saltOrRounds: 12,
      });

      expectBcryptServiceHashSuccess(result);
    });

    test("should return error when salt is a random string", async () => {
      const [hash, error] = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
        saltOrRounds: "abc",
      });

      expect(hash).toBeNull();

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.INVALID_SALT_HASHING_STRING
      );
    });

    test("should return error when rounds is negative number", async () => {
      const [hash, error] = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
        saltOrRounds: -1,
      });

      expect(hash).toBeNull();

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error?.errorDefinition).toEqual(ERROR_DEFINITIONS.ROUNDS_NEGATIVE);
    });

    test("should return error when rounds is less than one", async () => {
      const [hash, error] = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
        saltOrRounds: 0,
      });

      expect(hash).toBeNull();

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.ROUNDS_LESS_THAN_ONE
      );
    });
  });

  describe("bcryptService.compare", () => {
    test("should return true when password matches the hash", async () => {
      const resultHashing = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
      });

      expectBcryptServiceHashSuccess(resultHashing);

      const [hash] = resultHashing;

      const resultComparing = await bcryptService.compare({
        data: TEST_USER_PASSWORD,
        encrypted: hash,
      });

      expectBcryptServiceCompareAnyResult({
        data: resultComparing,
        result: true,
      });
    });

    test("should return false when password does not match the hash", async () => {
      const resultHashing = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
      });

      expectBcryptServiceHashSuccess(resultHashing);

      const [hash] = resultHashing;

      const resultComparing = await bcryptService.compare({
        data: TEST_USER_ALTERNATIVE_PASSWORD,
        encrypted: hash,
      });

      expectBcryptServiceCompareAnyResult({
        data: resultComparing,
        result: false,
      });
    });

    test("should return false when comparing valid string with empty hash", async () => {
      const resultComparing = await bcryptService.compare({
        data: TEST_USER_PASSWORD,
        encrypted: "",
      });

      expectBcryptServiceCompareAnyResult({
        data: resultComparing,
        result: false,
      });
    });

    test("should return false when comparing empty string with valid hash", async () => {
      const resultHashing = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
      });

      expectBcryptServiceHashSuccess(resultHashing);
      const [hash] = resultHashing;

      const resultComparing = await bcryptService.compare({
        data: "",
        encrypted: hash,
      });

      expectBcryptServiceCompareAnyResult({
        data: resultComparing,
        result: false,
      });
    });

    test("should return false when data and hash arguments are swapped", async () => {
      const resultHashing = await bcryptService.hash({
        data: TEST_USER_PASSWORD,
      });

      expectBcryptServiceHashSuccess(resultHashing);
      const [hash] = resultHashing;

      const resultComparing = await bcryptService.compare({
        data: hash,
        encrypted: TEST_USER_PASSWORD,
      });

      expectBcryptServiceCompareAnyResult({
        data: resultComparing,
        result: false,
      });
    });
  });
});
