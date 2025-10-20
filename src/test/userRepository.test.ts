import mongoose from "mongoose";
import { UserModel } from "../models";
import { userRepository } from "../repositories";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import {
  TEST_USER_EMAIL,
  TEST_USER_EMAIL_PARTIAL,
  TEST_USER_EMAIL_UPPERCASE,
} from "./constants";
import {
  expectValidDate,
  expectCreateUserInDb,
  expectFindOneUserInDb,
} from "./utils";

beforeAll(async () => {
  await connectDatabase();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("userRepository", () => {
  describe("userRepository.create", () => {
    test("should add a user to the database", async () => {
      await expectCreateUserInDb();
    });

    test("should give new users correct email", async () => {
      const createdUser = await expectCreateUserInDb();
      expect(createdUser.email).toEqual(TEST_USER_EMAIL);
    });

    test("should return user", async () => {
      const createdUser = await expectCreateUserInDb();
      expect(mongoose.Types.ObjectId.isValid(createdUser._id)).toBe(true);
      expect(createdUser.email).toEqual(TEST_USER_EMAIL);
      expectValidDate(createdUser.createdAt);
      expectValidDate(createdUser.updatedAt);
    });
  });

  describe("userRepository.findOne", () => {
    test("should return user when email exists", async () => {
      await expectCreateUserInDb();
      await expectFindOneUserInDb();
    });

    test("should return null when user with given email does not exist", async () => {
      const [foundUser, errorFindOneUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL,
      });

      expect(foundUser).toBeNull();
      expect(errorFindOneUser).toBeNull();
    });

    test("should return correct user data structure", async () => {
      await expectCreateUserInDb();
      const foundUser = await expectFindOneUserInDb();
      expect(mongoose.Types.ObjectId.isValid(foundUser._id)).toBe(true);
      expect(foundUser.email).toEqual(TEST_USER_EMAIL);
      expectValidDate(foundUser.createdAt);
      expectValidDate(foundUser.updatedAt);
    });

    test("should be case-sensitive for email lookup", async () => {
      await expectCreateUserInDb();

      const [foundUser, errorFindOneUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL_UPPERCASE,
      });

      expect(foundUser).toBeNull();
      expect(errorFindOneUser).toBeNull();
    });

    test("should find user by exact email match", async () => {
      await expectCreateUserInDb();

      const [foundUser, errorFindOneUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL_PARTIAL,
      });

      expect(foundUser).toBeNull();
      expect(errorFindOneUser).toBeNull();
    });

    test.todo("should not modify or create any new user in the database");
  });
});
