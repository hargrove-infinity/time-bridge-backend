import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { ApplicationError } from "../errors";
import {
  DEFAULT_EXPIRES_IN_TOKEN_NUMBER,
  ERROR_DEFINITIONS,
  ONE_HOUR_IN_SECONDS,
  MINUTES_IN_MILLISECONDS,
} from "../constants";
import { EmailConfirmationModel, UserModel } from "../models";
import { emailConfirmationRepository, userRepository } from "../repositories";
import { emailService, userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import {
  MOCK_SUCCESS_SEND_EMAIL_RESPONSE,
  TEST_EMAIL_CONFIRMATION_CODE,
  TEST_USER_ALTERNATIVE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from "./constants";
import {
  createMockEmailConfirmations,
  expectEmailConfirmRepoFindOneSuccess,
  expectUserRepoCreateSuccess,
  expectUserRepoFindOneSuccess,
  expectUserServiceLoginSuccess,
  expectUserServiceRegisterSuccess,
  expectValidDate,
  sleep,
} from "./utils";

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await UserModel.deleteMany({});
  await EmailConfirmationModel.deleteMany({});
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
      spy.mockRestore();
    });

    test("should not store user's password as plain text", async () => {
      const [user, error] = await userService.register({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(error).toBeNull();
      expect(user).toBeDefined();

      const userInDb = await expectUserRepoFindOneSuccess();

      expect(userInDb.password).not.toBe(TEST_USER_PASSWORD);
    });

    test("stored password in database and password was sent should match", async () => {
      const [user, error] = await userService.register({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(error).toBeNull();
      expect(user).toBeDefined();

      const userInDb = await expectUserRepoFindOneSuccess();

      const isPasswordsMatched = await bcrypt.compare(
        TEST_USER_PASSWORD,
        userInDb.password
      );

      expect(isPasswordsMatched).toBe(true);
    });

    test("should return correct payload", async () => {
      await expectUserServiceRegisterSuccess();
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

      spyOnCreateConfirmationRepo.mockRestore();
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

      spyOnEmailServiceSendEmailMockImpl.mockRestore();
    });
  });

  describe("userService.emailConfirm", () => {
    test("should call userRepository.findOne", async () => {
      const spy = jest.spyOn(userRepository, "findOne");

      await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: TEST_EMAIL_CONFIRMATION_CODE,
      });

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test("should call emailConfirmationRepository.findOneAndUpdate", async () => {
      await expectUserServiceRegisterSuccess();

      const spy = jest.spyOn(emailConfirmationRepository, "findOneAndUpdate");

      await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: TEST_EMAIL_CONFIRMATION_CODE,
      });

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test("should find and update email confirmation document", async () => {
      await expectUserServiceRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocumentBefore =
        await expectEmailConfirmRepoFindOneSuccess({ user: userInDb._id });

      await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: emailConfirmDocumentBefore.code,
      });

      const emailConfirmDocumentAfter =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
          code: emailConfirmDocumentBefore.code,
        });

      expect(emailConfirmDocumentAfter?.isEmailConfirmed).toBe(true);
    });

    test("should return a JWT token with correct payload", async () => {
      await expectUserServiceRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocumentBefore =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
        });

      await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: emailConfirmDocumentBefore.code,
      });

      const emailConfirmDocumentAfter =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
          code: emailConfirmDocumentBefore.code,
        });

      expect(emailConfirmDocumentAfter?.isEmailConfirmed).toBe(true);

      const decoded = await expectUserServiceLoginSuccess();
      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
    });

    test("should return a JWT token with correct expiration time", async () => {
      await expectUserServiceRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocumentBefore =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
        });

      await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: emailConfirmDocumentBefore.code,
      });

      const emailConfirmDocumentAfter =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
          code: emailConfirmDocumentBefore.code,
        });

      expect(emailConfirmDocumentAfter?.isEmailConfirmed).toBe(true);

      const decoded = await expectUserServiceLoginSuccess();
      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
      const expiresInHrs = (decoded.exp - decoded.iat) / ONE_HOUR_IN_SECONDS;
      expect(expiresInHrs).toBe(DEFAULT_EXPIRES_IN_TOKEN_NUMBER);
    });

    test("should throw an error when email is not found", async () => {
      const [token, errorEmailConfirm] = await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: TEST_EMAIL_CONFIRMATION_CODE,
      });

      expect(token).toBeNull();
      expect(errorEmailConfirm).toBeInstanceOf(ApplicationError);
      expect(errorEmailConfirm?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.EMAIL_CONFIRMATION_FAILED
      );
    });

    test("should throw an error when code is wrong", async () => {
      await expectUserServiceRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocumentBefore =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
        });

      const wrongCode = (parseInt(emailConfirmDocumentBefore.code) + 1)
        .toString()
        .padStart(6, "0");

      const [token, errorEmailConfirm] = await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: wrongCode,
      });

      expect(token).toBeNull();
      expect(errorEmailConfirm).toBeInstanceOf(ApplicationError);
      expect(errorEmailConfirm?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.EMAIL_CONFIRMATION_FAILED
      );
    });
  });

  describe("userService.resendCode", () => {
    test("should return error when user does not exist", async () => {
      const [resultResendCode, errorResendCode] = await userService.resendCode(
        TEST_USER_EMAIL
      );

      expect(resultResendCode).toBeNull();
      expect(errorResendCode).toBeInstanceOf(ApplicationError);
      expect(errorResendCode?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.RESEND_CODE_FAILED
      );
    });

    test("should return nextResendTime when user has 4 resend attempts (one below maximum)", async () => {
      const userInDb = await expectUserRepoCreateSuccess();

      const documents = createMockEmailConfirmations({
        userId: userInDb._id,
        shouldIncludeLast: false,
      });

      await EmailConfirmationModel.insertMany(documents);

      const [resultResendCode, errorResendCode] = await userService.resendCode(
        TEST_USER_EMAIL
      );

      expect(errorResendCode).toBeNull();

      if (!resultResendCode || !resultResendCode?.nextResendTime) {
        throw new Error("nextResendTime is missing");
      }

      expectValidDate(resultResendCode.nextResendTime);
    });

    test("should return error when user reaches maximum 5 resend attempts", async () => {
      const userInDb = await expectUserRepoCreateSuccess();

      const documents = createMockEmailConfirmations({
        userId: userInDb._id,
        shouldIncludeLast: true,
      });

      await EmailConfirmationModel.insertMany(documents);

      const [resultResendCode, errorResendCode] = await userService.resendCode(
        TEST_USER_EMAIL
      );

      expect(resultResendCode).toBeNull();
      expect(errorResendCode).toBeInstanceOf(ApplicationError);
      expect(errorResendCode?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.EMAIL_CONFIRM_RESEND_LIMIT_REACHED_BLOCKED
      );
    });

    test("should call userRepository.findOne to look up user", async () => {
      const spy = jest.spyOn(userRepository, "findOne");
      await userService.resendCode(TEST_USER_EMAIL);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test("should call emailConfirmationRepository.find to retrieve confirmation history", async () => {
      const spy = jest.spyOn(emailConfirmationRepository, "find");
      await expectUserRepoCreateSuccess();
      await userService.resendCode(TEST_USER_EMAIL);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test("should fetch emailConfirmation documents sorted by createdAt in descending order", async () => {
      const spy = jest.spyOn(emailConfirmationRepository, "find");
      const userInDb = await expectUserRepoCreateSuccess();
      await userService.resendCode(TEST_USER_EMAIL);

      expect(spy).toHaveBeenCalledWith({
        filter: { user: userInDb._id },
        projection: {},
        options: { sort: { createdAt: "desc" } },
      });

      spy.mockRestore();
    });

    test("should return nextResendTime when user requests resend before delay period expires", async () => {
      await expectUserServiceRegisterSuccess();
      await userService.resendCode(TEST_USER_EMAIL);
      await sleep(3000);

      const [resultResendCode, errorResendCode] = await userService.resendCode(
        TEST_USER_EMAIL
      );

      expect(errorResendCode).toBeNull();

      if (!resultResendCode || !resultResendCode.nextResendTime) {
        throw new Error("nextResendTime is missing");
      }

      expectValidDate(resultResendCode.nextResendTime);
    });

    test("should create new emailConfirmation document when user waits required delay between resends", async () => {
      const spy = jest.spyOn(emailConfirmationRepository, "create");
      await expectUserServiceRegisterSuccess();
      await userService.resendCode(TEST_USER_EMAIL);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test("should return nextResendTime successfully when user waits required delay between resends", async () => {
      const spyOnEmailServiceSendEmailMockImpl = jest
        .spyOn(emailService, "sendEmail")
        .mockImplementation(async () => {
          return [MOCK_SUCCESS_SEND_EMAIL_RESPONSE, null];
        });

      await userService.register({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      await sleep(10100);

      const [resultResendCode, errorResendCode] = await userService.resendCode(
        TEST_USER_EMAIL
      );

      expect(errorResendCode).toBeNull();

      if (!resultResendCode || !resultResendCode.nextResendTime) {
        throw new Error("nextResendTime is missing");
      }

      expectValidDate(resultResendCode.nextResendTime);

      spyOnEmailServiceSendEmailMockImpl.mockRestore();
    }, 15000);

    test("should send email with correct format and content after delay period", async () => {
      const spyOnEmailServiceSendEmailMockImpl = jest
        .spyOn(emailService, "sendEmail")
        .mockImplementation(async () => {
          return [MOCK_SUCCESS_SEND_EMAIL_RESPONSE, null];
        });

      await userService.register({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      await sleep(10100);

      await userService.resendCode(TEST_USER_EMAIL);

      expect(spyOnEmailServiceSendEmailMockImpl).toHaveBeenCalled();

      const call = spyOnEmailServiceSendEmailMockImpl.mock.calls[1];

      expect(call?.[0].html).toMatch(/^Your code is/);
      expect(call?.[0].html.length).toBe(19);
      expect(call?.[0].subject).toBe("Registration");
      expect(call?.[0].toEmail).toBe(TEST_USER_EMAIL);

      spyOnEmailServiceSendEmailMockImpl.mockRestore();
    }, 15000);
  });

  describe("userService.login", () => {
    test("should call userRepository.findOne", async () => {
      const spy = jest.spyOn(userRepository, "findOne");

      await userService.login({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
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
      await expectUserServiceRegisterSuccess();

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

    test("should throw an error when user's email is not confirmed", async () => {
      await expectUserServiceRegisterSuccess();

      const [token, errorLogin] = await userService.login({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      expect(token).toBeNull();

      expect(errorLogin).toBeInstanceOf(ApplicationError);
      expect(errorLogin?.errorDefinition).toEqual(
        ERROR_DEFINITIONS.LOGIN_FAILED
      );
    });

    test("should return a JWT token with correct payload", async () => {
      await expectUserServiceRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocumentBefore =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
        });

      await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: emailConfirmDocumentBefore.code,
      });

      const emailConfirmDocumentAfter =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
          code: emailConfirmDocumentBefore.code,
        });

      expect(emailConfirmDocumentAfter?.isEmailConfirmed).toBe(true);

      const decoded = await expectUserServiceLoginSuccess();
      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
    });

    test("should return a JWT token with correct expiration time", async () => {
      await expectUserServiceRegisterSuccess();

      const userInDb = await expectUserRepoFindOneSuccess();

      const emailConfirmDocumentBefore =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
        });

      await userService.emailConfirm({
        email: TEST_USER_EMAIL,
        code: emailConfirmDocumentBefore.code,
      });

      const emailConfirmDocumentAfter =
        await expectEmailConfirmRepoFindOneSuccess({
          user: userInDb._id,
          code: emailConfirmDocumentBefore.code,
        });

      expect(emailConfirmDocumentAfter?.isEmailConfirmed).toBe(true);

      const decoded = await expectUserServiceLoginSuccess();
      expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
      const expiresInHrs = (decoded.exp - decoded.iat) / ONE_HOUR_IN_SECONDS;
      expect(expiresInHrs).toBe(DEFAULT_EXPIRES_IN_TOKEN_NUMBER);
    });
  });
});
