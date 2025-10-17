import mongoose from "mongoose";
import { UserModel } from "../models";
import { userRepository } from "../repositories";
import { closeConnectionDatabase, connectDatabase } from "../utils";

const MOCK_EMAIL = "mail@mail.com";
const MOCK_PASSWORD = "password";

function validateDate(date: NativeDate): boolean {
  const convertedDate = new Date(date);
  return !isNaN(convertedDate.getTime());
}

describe("create user", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await closeConnectionDatabase();
  });

  test("should add a user to the database", async () => {
    const [createdUser, errorCreateUser] = await userRepository.create({
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    });

    // Assert
    expect(createdUser).toEqual(expect.anything());
    expect(errorCreateUser).toBeNull();
  });

  test("should give new users correct email", async () => {
    const [user] = await userRepository.create({
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    });

    // Assert
    expect(user?.email).toEqual(MOCK_EMAIL);
  });

  test("should return user", async () => {
    const [createdUser] = await userRepository.create({
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    });

    // Assert
    expect(createdUser).toEqual(expect.anything());

    expect(mongoose.Types.ObjectId.isValid(createdUser?.id)).toBe(true);

    expect(createdUser?.email).toEqual(MOCK_EMAIL);

    if (createdUser) {
      const validCreatedAt = validateDate(createdUser.createdAt);
      expect(validCreatedAt).toBe(true);

      const validUpdatedAt = validateDate(createdUser.updatedAt);
      expect(validUpdatedAt).toBe(true);
    }
  });

  // Login
  // - Happy path: find a user that definitely exists in the database
  test("should return user when email exists", async () => {
    const [createdUser, errorCreateUser] = await userRepository.create({
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    });

    // Assert
    expect(createdUser).toEqual(expect.anything());
    expect(errorCreateUser).toBeNull();

    const [foundUser, errorFindOneUser] = await userRepository.findOne({
      email: MOCK_EMAIL,
    });

    // Assert
    expect(foundUser).toEqual(expect.anything());
    expect(errorFindOneUser).toBeNull();
  });

  // - Edge case: searching for a user that was never created
  test("should return null when user with given email does not exist", async () => {
    const [foundUser, errorFindOneUser] = await userRepository.findOne({
      email: MOCK_EMAIL,
    });

    console.log("foundUser", foundUser);
    console.log("errorFindOneUser", errorFindOneUser);

    // Assert
    expect(foundUser).toBeNull();
    expect(errorFindOneUser).toBeNull();
  });

  // - Security/correctness: verify the password field is stripped from the result (following pattern from create)
  test.todo("should return user without password field");
  // - Validation: ensure the returned user has _id, email, createdAt, updatedAt (matching UserDocumentWithoutPassword type)
  test.todo("should return correct user data structure");
  // - Error handling: if something goes wrong (like database connection issues), it should return an error following [null, ErrorData] pattern
  test.todo("should handle error when database fails");
  // - Edge case: verify if searching for "TEST@EMAIL.COM" doesn't find "test@email.com" (or define the intended behavior)
  test.todo("should be case-sensitive for email lookup");
  // - Correctness: ensure it's matching the exact email you're searching for, not partial matches
  test.todo("should find user by exact email match");
  // - Error handling: send custom error response instead of raw db error
  test.todo("should handle database errors and return appropriate error data");
  //- Correctness: ensure that calling findOne is a pure read operation — it shouldn’t alter existing users or insert new ones
  test.todo("should not modify or create any new user in the database");
});
