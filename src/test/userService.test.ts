import bcrypt from "bcrypt";
import { UserModel } from "../models";
import { userRepository } from "../repositories";
import { jwtService, userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./constants";
import { expectTokenString, expectUserDocument } from "./utils";

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("userService.create", () => {
  test("should call userRepository.create", async () => {
    const spy = jest.spyOn(userRepository, "create");

    await userService.create({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    expect(spy).toHaveBeenCalled();
  });

  test("should not store user's password as plain text", async () => {
    const [user, error] = await userService.create({
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
    const [user, error] = await userService.create({
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

  test("should return JWT", async () => {
    const [token, errorCreateUser] = await userService.create({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    expect(errorCreateUser).toBe(null);

    expectTokenString(token);

    const [verifyResult, errorVerify] = jwtService.verify({ token });

    expect(verifyResult).toBeDefined();
    expect(verifyResult).not.toBeNull();

    expect(typeof verifyResult).not.toBe("string");
    expect(typeof verifyResult).toBe("object");

    expect(verifyResult).toMatchObject({
      email: TEST_USER_EMAIL,
      iat: expect.any(Number),
      exp: expect.any(Number),
    });

    expect(errorVerify).toBe(null);
  });

  test("should call userRepository.findOne", async () => {
    const spy = jest.spyOn(userRepository, "findOne");

    await userService.login({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    expect(spy).toHaveBeenCalled();
  });
});
