import mongoose from "mongoose";
import { UserModel } from "../models";
import { userRepository } from "../repositories";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./constants";
import { expectToFulfillCreatedUser, validateDate } from "./utils";

beforeAll(async () => {
  await connectDatabase();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("create user", () => {
  test("should add a user to the database", async () => {
    const result = await userRepository.create({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    expect(result).toEqual(expect.anything());
  });

  test("should give new users correct email", async () => {
    const [user] = await userRepository.create({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    expect(user?.email).toEqual(TEST_USER_EMAIL);
  });

  test("should return user", async () => {
    const [createdUser] = await userRepository.create({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    expectToFulfillCreatedUser(createdUser);

    expect(mongoose.Types.ObjectId.isValid(createdUser._id)).toBe(true);

    expect(createdUser.email).toEqual(TEST_USER_EMAIL);

    validateDate(createdUser.createdAt);

    validateDate(createdUser.updatedAt);
  });
});
