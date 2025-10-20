import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  DEFAULT_EXPIRES_IN_TOKEN_NUMBER,
  ERROR_MESSAGES,
  ONE_HOUR_IN_SECONDS,
} from "../constants";
import { UserModel } from "../models";
import { userRepository } from "../repositories";
import { jwtService, userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import {
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";
import {
  expectCreateUserInService,
  expectTokenString,
  expectUserDocument,
  expectLoginUserServiceReturnsValidJwt,
} from "./utils";

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("userService", () => {
  describe("userService.create", () => {
    test("should call userRepository.create", async () => {
      const spy = jest.spyOn(userRepository, "create");

      await userService.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(spy).toHaveBeenCalled();
    });

    test("should not store user's password as plain text", async () => {
      const [user, error] = await userService.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(error).toBeNull();
      expect(user).toBeDefined();

      const userInDb = await UserModel.findOne({ email: TEST_USER_EMAIL });

      expectUserDocument(userInDb);

      expect(userInDb.password).not.toBe(TEST_USER_PASSWORD);
    });

    test("stored password in database and password was sent should match", async () => {
      const [user, error] = await userService.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(error).toBeNull();
      expect(user).toBeDefined();

      const userInDb = await UserModel.findOne({ email: TEST_USER_EMAIL });

      expectUserDocument(userInDb);

      const isPasswordsMatched = await bcrypt.compare(
        TEST_USER_PASSWORD,
        userInDb.password
      );

      expect(isPasswordsMatched).toBe(true);
    });

    test("should return JWT", async () => {
      const [token, errorCreateUser] = await userService.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(errorCreateUser).toBe(null);

      expectTokenString(token);

      const [verifyResult, errorVerify] = jwtService.verify({ token });

      expect(verifyResult).toBeDefined();
      expect(verifyResult).not.toBeNull();

      expect(typeof verifyResult).not.toBe("string");
      expect(typeof verifyResult).toBe("object");

      expect(verifyResult).toMatchObject({
        email: TEST_USER_EMAIL,
        iat: expect.any(Number),
        exp: expect.any(Number),
      });

      expect(errorVerify).toBe(null);
    });
  });

  describe("userService.login", () => {
    test("should call userRepository.findOne", async () => {
      const spy = jest.spyOn(userRepository, "findOne");

      await userService.login({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(spy).toHaveBeenCalled();
    });

    test("should throw an error when email does not exist", async () => {
      const [token, errorLoginUser] = await userService.login({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(token).toBeNull();
      expect(errorLoginUser).toEqual({
        errors: [ERROR_MESSAGES.USER_EMAIL_NOT_EXIST],
      });
    });

    test("should throw an error when password is incorrect", async () => {
      await expectCreateUserInService();

      const [tokenLoginUser, errorLoginUser] = await userService.login({
        email: TEST_USER_EMAIL,
        password: TEST_USER_ALTERNATIVE_PASSWORD,
      });

      expect(tokenLoginUser).toBeNull();
      expect(errorLoginUser).toEqual({
        errors: [ERROR_MESSAGES.USER_PASSWORD_WRONG],
      });
    });

    test("should return a JWT token with correct payload", async () => {
      await expectCreateUserInService();
      const decoded = await expectLoginUserServiceReturnsValidJwt();
      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
    });

    test("should return a JWT token with correct expiration time", async () => {
      await expectCreateUserInService();
      const decoded = await expectLoginUserServiceReturnsValidJwt();
      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
      const expiresInHrs = (decoded.exp - decoded.iat) / ONE_HOUR_IN_SECONDS;
      expect(expiresInHrs).toBe(DEFAULT_EXPIRES_IN_TOKEN_NUMBER);
    });
  });
});
