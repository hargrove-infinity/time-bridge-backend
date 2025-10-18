import mongoose from "mongoose";
import { UserModel } from "../models";
import { userRepository } from "../repositories";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import {
  TEST_USER_EMAIL,
  TEST_USER_EMAIL_UPPERCASE,
  TEST_USER_PASSWORD,
} from "./constants";
import { expectCreatedUser, expectValidDate } from "./utils";

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
      const [createdUser, errorCreateUser] = await userRepository.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      // Assert
      expect(createdUser).toEqual(expect.anything());
      expect(errorCreateUser).toBeNull();
    });

    test("should give new users correct email", async () => {
      const [createdUser, errorCreateUser] = await userRepository.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      // Assert
      expect(createdUser).toEqual(expect.anything());
      expect(errorCreateUser).toBeNull();
      expect(createdUser?.email).toEqual(TEST_USER_EMAIL);
    });

    test("should return user", async () => {
      const [createdUser, errorCreateUser] = await userRepository.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      // Assert
      expect(createdUser).toEqual(expect.anything());
      expect(errorCreateUser).toBeNull();

      expectCreatedUser(createdUser);

      expect(mongoose.Types.ObjectId.isValid(createdUser._id)).toBe(true);

      expect(createdUser.email).toEqual(TEST_USER_EMAIL);

      expectValidDate(createdUser.createdAt);

      expectValidDate(createdUser.updatedAt);
    });
  });

  describe("userRepository.findOne", () => {
    // Login
    // - Happy path: find a user that definitely exists in the database
    test("should return user when email exists", async () => {
      const [createdUser, errorCreateUser] = await userRepository.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      // Assert
      expect(createdUser).toEqual(expect.anything());
      expect(errorCreateUser).toBeNull();

      const [foundUser, errorFindOneUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL,
      });

      // Assert
      expect(foundUser).toEqual(expect.anything());
      expect(errorFindOneUser).toBeNull();
    });

    // - Edge case: searching for a user that was never created
    test("should return null when user with given email does not exist", async () => {
      const [foundUser, errorFindOneUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL,
      });

      // Assert
      expect(foundUser).toBeNull();
      expect(errorFindOneUser).toBeNull();
    });

    // - Security/correctness: verify the password field is stripped from the result (following pattern from create)
    test("should return user without password field", async () => {
      const [createdUser, errorCreateUser] = await userRepository.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      // Assert
      expect(createdUser).toEqual(expect.anything());
      expect(errorCreateUser).toBeNull();

      const [foundUser, errorFindOneUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL,
      });

      // Assert
      expect(foundUser).toEqual(expect.anything());
      expect(errorFindOneUser).toBeNull();
      expect(foundUser).not.toHaveProperty("password");
    });

    // - Validation: ensure the returned user has _id, email, createdAt, updatedAt (matching UserDocumentWithoutPassword type)
    test("should return correct user data structure", async () => {
      const [createdUser, errorCreateUser] = await userRepository.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      // Assert
      expect(createdUser).toEqual(expect.anything());
      expect(errorCreateUser).toBeNull();

      const [foundUser, errorFindOneUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL,
      });

      // Assert
      expect(foundUser).toEqual(expect.anything());
      expect(errorFindOneUser).toBeNull();

      expectCreatedUser(foundUser);

      expect(mongoose.Types.ObjectId.isValid(foundUser._id)).toBe(true);

      expect(foundUser.email).toEqual(TEST_USER_EMAIL);

      expectValidDate(foundUser.createdAt);

      expectValidDate(foundUser.updatedAt);
    });

    // - Edge case: verify if searching for "TEST@EMAIL.COM" doesn't find "test@email.com" (or define the intended behavior)
    test("should be case-sensitive for email lookup", async () => {
      const [createdUser, errorCreateUser] = await userRepository.create({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });

      // Assert
      expect(createdUser).toEqual(expect.anything());
      expect(errorCreateUser).toBeNull();

      const [foundUser, errorFindOneUser] = await userRepository.findOne({
        email: TEST_USER_EMAIL_UPPERCASE,
      });

      // Assert
      expect(foundUser).toBeNull();
      expect(errorFindOneUser).toBeNull();
    });

    // - Correctness: ensure it's matching the exact email you're searching for, not partial matches
    test.todo("should find user by exact email match");
    // - Error handling: if something goes wrong (like database connection issues), it should return an error following [null, ErrorData] pattern
    test.todo("should handle error when database fails");
    // - Error handling: send custom error response instead of raw db error
    test.todo(
      "should handle database errors and return appropriate error data"
    );
    //- Correctness: ensure that calling findOne is a pure read operation — it shouldn’t alter existing users or insert new ones
    test.todo("should not modify or create any new user in the database");
  });
});
