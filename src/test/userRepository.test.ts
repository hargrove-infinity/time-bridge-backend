import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { FIELD_NAMES, ERROR_MESSAGES } from "../constants";
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

  test("should fail: undefined email", async () => {
    const [, error] = await userRepository.create({ password: MOCK_PASSWORD });

    // Assert
    expect(error).toBeInstanceOf(ZodError);
    const zodError = error as ZodError;

    expect(zodError.issues[0]?.message).toBe(ERROR_MESSAGES.EMAIL_UNDEFINED);
    expect(zodError.issues[0]?.path).toEqual([FIELD_NAMES.EMAIL]);
  });

  test("should fail: empty email", async () => {
    const [, error] = await userRepository.create({
      email: "",
      password: MOCK_PASSWORD,
    });

    // Assert
    expect(error).toBeInstanceOf(ZodError);
    const zodError = error as ZodError;

    expect(zodError.issues[0]?.message).toBe(ERROR_MESSAGES.EMAIL_EMPTY);
    expect(zodError.issues[0]?.path).toEqual([FIELD_NAMES.EMAIL]);
  });

  test("should fail: invalid email", async () => {
    const [, error] = await userRepository.create({
      email: "abc",
      password: MOCK_PASSWORD,
    });

    // Assert
    expect(error).toBeInstanceOf(ZodError);
    const zodError = error as ZodError;

    expect(zodError.issues[0]?.message).toBe(ERROR_MESSAGES.EMAIL_INVALID);
    expect(zodError.issues[0]?.path).toEqual([FIELD_NAMES.EMAIL]);
  });

  test("should fail: undefined password", async () => {
    const [, error] = await userRepository.create({ email: MOCK_EMAIL });

    // Assert
    expect(error).toBeInstanceOf(ZodError);
    const zodError = error as ZodError;

    expect(zodError.issues[0]?.message).toBe(ERROR_MESSAGES.PASSWORD_UNDEFINED);
    expect(zodError.issues[0]?.path).toEqual([FIELD_NAMES.PASSWORD]);
  });

  test("should fail: password too short", async () => {
    const [, error] = await userRepository.create({
      email: MOCK_EMAIL,
      password: "321",
    });

    // Assert
    expect(error).toBeInstanceOf(ZodError);
    const zodError = error as ZodError;

    expect(zodError.issues[0]?.message).toBe(ERROR_MESSAGES.PASSWORD_LENGTH);
    expect(zodError.issues[0]?.path).toEqual([FIELD_NAMES.PASSWORD]);
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

  test("should hash new user's password", async () => {
    const [result] = await userRepository.create({
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    });

    if (!result) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(MOCK_PASSWORD, result.password);

    // Assert
    expect(match).toEqual(true);
  });

  test("should not store user's password as plain text", async () => {
    const [result] = await userRepository.create({
      email: MOCK_EMAIL,
      password: MOCK_PASSWORD,
    });

    // Assert
    expect(result?.password).toEqual(expect.anything());
    expect(result?.password).not.toEqual(MOCK_PASSWORD);
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
      const match = await bcrypt.compare(MOCK_PASSWORD, createdUser.password);
      expect(match).toBe(true);

      const validCreatedAt = validateDate(createdUser.createdAt);
      expect(validCreatedAt).toBe(true);

      const validUpdatedAt = validateDate(createdUser.updatedAt);
      expect(validUpdatedAt).toBe(true);
    }
  });
});
