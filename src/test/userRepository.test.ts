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
    await UserModel.deleteMany({});
    await closeConnectionDatabase();
  });

  test("should add a user to the database", async () => {
    const result = await userRepository.create({
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    });

    // Assert
    expect(result).toEqual(expect.anything());
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
});
