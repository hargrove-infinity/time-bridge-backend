import mongoose from "mongoose";
import { MINUTES_IN_MILLISECONDS } from "../constants";
import { EmailConfirmationModel } from "../models";
import { emailConfirmationRepository } from "../repositories";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { TEST_EMAIL_CONFIRMATION_CODE, TEST_USER_ID_STRING } from "./constants";
import { expectEmailConfirmRepoCreateSuccess, sleep } from "./utils";

beforeAll(async () => {
  await connectDatabase();
});

beforeEach(async () => {
  await EmailConfirmationModel.deleteMany({});
});

afterAll(async () => {
  await EmailConfirmationModel.deleteMany({});
  await closeConnectionDatabase();
});

describe("emailConfirmationRepository", () => {
  describe("emailConfirmationRepository.create", () => {
    test("should create email confirmation with valid data", async () => {
      const userId = new mongoose.Types.ObjectId(TEST_USER_ID_STRING);
      const expireCodeTime = new Date(Date.now() + MINUTES_IN_MILLISECONDS[30]);

      await expectEmailConfirmRepoCreateSuccess({
        user: userId,
        isEmailSent: true,
        isEmailConfirmed: false,
        code: TEST_EMAIL_CONFIRMATION_CODE,
        expireCodeTime,
      });
    });
  });

  describe("emailConfirmationRepository.findOne", () => {
    test("should return null when given user's email and code does not exist", async () => {
      const userId = new mongoose.Types.ObjectId(TEST_USER_ID_STRING);

      const [foundEmailConfirmation, errorFindOneEmailConfirmation] =
        await emailConfirmationRepository.findOne({
          user: userId,
          code: TEST_EMAIL_CONFIRMATION_CODE,
        });

      expect(errorFindOneEmailConfirmation).toBeNull();
      expect(foundEmailConfirmation).toBeNull();
    });

    test("should return emailConfirmation when given user's email and code exist", async () => {
      const userId = new mongoose.Types.ObjectId(TEST_USER_ID_STRING);
      const expireCodeTime = new Date(Date.now() + MINUTES_IN_MILLISECONDS[30]);

      await expectEmailConfirmRepoCreateSuccess({
        user: userId,
        isEmailSent: true,
        isEmailConfirmed: false,
        code: TEST_EMAIL_CONFIRMATION_CODE,
        expireCodeTime,
      });

      const [foundEmailConfirmation, errorFindOneEmailConfirmation] =
        await emailConfirmationRepository.findOne({
          user: userId,
          code: TEST_EMAIL_CONFIRMATION_CODE,
        });

      expect(errorFindOneEmailConfirmation).toBeNull();

      expect(foundEmailConfirmation?.toObject()).toMatchObject({
        user: userId,
        isEmailSent: true,
        isEmailConfirmed: false,
        code: TEST_EMAIL_CONFIRMATION_CODE,
        expireCodeTime,
      });
    });
  });

  describe("emailConfirmationRepository.findOneAndUpdate", () => {
    test("should return emailConfirmation when given user's email and code exist and time is not expired", async () => {
      const userId = new mongoose.Types.ObjectId(TEST_USER_ID_STRING);
      const expireCodeTime = new Date(Date.now() + MINUTES_IN_MILLISECONDS[30]);

      const emailConfirmationData = {
        user: userId,
        isEmailSent: true,
        isEmailConfirmed: false,
        code: TEST_EMAIL_CONFIRMATION_CODE,
        expireCodeTime,
      };

      await expectEmailConfirmRepoCreateSuccess(emailConfirmationData);

      const [updatedEmailConfirmation, errorFindOneAndUpdateEmailConfirmation] =
        await emailConfirmationRepository.findOneAndUpdate({
          filter: {
            user: userId,
            code: TEST_EMAIL_CONFIRMATION_CODE,
            expireCodeTime: { $gt: new Date() },
          },
          update: { isEmailConfirmed: true },
          options: { new: true },
        });

      expect(errorFindOneAndUpdateEmailConfirmation).toBeNull();

      expect(updatedEmailConfirmation?.toObject()).toMatchObject({
        ...emailConfirmationData,
        isEmailConfirmed: true,
      });
    });

    test("should return null when given user's email and code does not exist", async () => {
      const userId = new mongoose.Types.ObjectId(TEST_USER_ID_STRING);

      const [updatedEmailConfirmation, errorFindOneAndUpdateEmailConfirmation] =
        await emailConfirmationRepository.findOneAndUpdate({
          filter: { user: userId, code: TEST_EMAIL_CONFIRMATION_CODE },
          update: { isEmailConfirmed: true },
          options: { new: true },
        });

      expect(errorFindOneAndUpdateEmailConfirmation).toBeNull();
      expect(updatedEmailConfirmation).toBeNull();
    });

    test("should return null when given user's email and code exist but time is expired", async () => {
      const userId = new mongoose.Types.ObjectId(TEST_USER_ID_STRING);
      const expireCodeTime = new Date(Date.now());

      await expectEmailConfirmRepoCreateSuccess({
        user: userId,
        isEmailSent: true,
        isEmailConfirmed: false,
        code: TEST_EMAIL_CONFIRMATION_CODE,
        expireCodeTime,
      });

      await sleep(1000);

      const [updatedEmailConfirmation, errorFindOneAndUpdateEmailConfirmation] =
        await emailConfirmationRepository.findOneAndUpdate({
          filter: {
            user: userId,
            code: TEST_EMAIL_CONFIRMATION_CODE,
            expireCodeTime: { $gt: new Date() },
          },
          update: { isEmailConfirmed: true },
          options: { new: true },
        });

      expect(errorFindOneAndUpdateEmailConfirmation).toBeNull();
      expect(updatedEmailConfirmation).toBeNull();
    });
  });
});
