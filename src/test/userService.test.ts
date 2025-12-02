import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { ApplicationError } from "../errors";
import {
  DEFAULT_EXPIRES_IN_TOKEN_NUMBER,
  ERROR_DEFINITIONS,
  ONE_HOUR_IN_SECONDS,
  MINUTES_IN_MILLISECONDS,
} from "../constants";
import { UserModel } from "../models";
import { emailConfirmationRepository, userRepository } from "../repositories";
import { emailService, userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import {
  MOCK_SUCCESS_SEND_EMAIL_RESPONSE,
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";
import {
  expectUserDocument,
  expectLoginUserServiceReturnsValidJwt,
  expectRegisterUserServiceSuccess,
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
  describe("userService.register", () => {
    test("should call userRepository.create", async () => {
      const spy = jest.spyOn(userRepository, "create");

      await userService.register({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(spy).toHaveBeenCalled();
    });

    test("should not store user's password as plain text", async () => {
      const [user, error] = await userService.register({
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
      const [user, error] = await userService.register({
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

    test("should return correct payload", async () => {
      await expectRegisterUserServiceSuccess();
    });

    test("should create email confirmation document", async () => {
      const spyOnCreateConfirmationRepo = jest.spyOn(
        emailConfirmationRepository,
        "create"
      );

      await userService.register({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(spyOnCreateConfirmationRepo).toHaveBeenCalled();

      const [foundUser, errorFoundUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL,
      });

      expect(errorFoundUser).toBeNull();

      const [foundEmailConfirmation, errorEmailConfirmation] =
        await emailConfirmationRepository.findOne({
          user: foundUser?._id,
        });

      expect(errorEmailConfirmation).toBeNull();

      expect(foundEmailConfirmation?.toObject()).toMatchObject({
        user: foundUser?._id,
        isEmailSent: true,
        isEmailConfirmed: false,
      });

      expect(foundEmailConfirmation?.expireCodeTime.getTime()).toBeGreaterThan(
        Date.now() + MINUTES_IN_MILLISECONDS[29]
      );

      expect(foundEmailConfirmation?.expireCodeTime.getTime()).toBeLessThan(
        Date.now() + MINUTES_IN_MILLISECONDS[31]
      );
    });

    test("should call sendEmail service", async () => {
      const spyOnEmailServiceSendEmailMockImpl = jest
        .spyOn(emailService, "sendEmail")
        .mockImplementation(async () => {
          return [MOCK_SUCCESS_SEND_EMAIL_RESPONSE, null];
        });

      await userService.register({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(spyOnEmailServiceSendEmailMockImpl).toHaveBeenCalled();

      const call = spyOnEmailServiceSendEmailMockImpl.mock.calls[0];

      expect(call?.[0].html).toMatch(/^Your code is/);
      expect(call?.[0].html.length).toBe(19);
      expect(call?.[0].subject).toBe("Registration");
      expect(call?.[0].toEmail).toBe(TEST_USER_EMAIL);
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

      expect(errorLoginUser).toBeInstanceOf(ApplicationError);
      expect(errorLoginUser?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.LOGIN_FAILED
      );
    });

    test("should throw an error when password is incorrect", async () => {
      await expectRegisterUserServiceSuccess();

      const [tokenLoginUser, errorLoginUser] = await userService.login({
        email: TEST_USER_EMAIL,
        password: TEST_USER_ALTERNATIVE_PASSWORD,
      });

      expect(tokenLoginUser).toBeNull();

      expect(errorLoginUser).toBeInstanceOf(ApplicationError);
      expect(errorLoginUser?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.LOGIN_FAILED
      );
    });

    test("should return a JWT token with correct payload", async () => {
      await expectRegisterUserServiceSuccess();

      const decoded = await expectLoginUserServiceReturnsValidJwt();
      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
    });

    test("should return a JWT token with correct expiration time", async () => {
      await expectRegisterUserServiceSuccess();
      const decoded = await expectLoginUserServiceReturnsValidJwt();
      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
      const expiresInHrs = (decoded.exp - decoded.iat) / ONE_HOUR_IN_SECONDS;
      expect(expiresInHrs).toBe(DEFAULT_EXPIRES_IN_TOKEN_NUMBER);
    });
  });
});
