import mongoose from "mongoose";
import { THIRTY_MINS_IN_MILLISECONDS } from "../constants";
import { EmailConfirmationModel } from "../models";
import { emailConfirmationRepository } from "../repositories";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { TEST_EMAIL_CONFIRMATION_CODE, TEST_USER_ID_STRING } from "./constants";

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
      const expireCodeTime = new Date(Date.now() + THIRTY_MINS_IN_MILLISECONDS);

      const [createdEmailConfirmation, errorCreateEmailConfirmation] =
        await emailConfirmationRepository.create({
          user: userId,
          isEmailSent: false,
          isEmailConfirmed: false,
          code: TEST_EMAIL_CONFIRMATION_CODE,
          expireCodeTime,
        });

      expect(errorCreateEmailConfirmation).toBeNull();

      expect(createdEmailConfirmation?.toObject()).toMatchObject({
        user: userId,
        isEmailSent: false,
        isEmailConfirmed: false,
        code: TEST_EMAIL_CONFIRMATION_CODE,
        expireCodeTime,
      });
    });
  });
});
