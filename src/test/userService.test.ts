import bcrypt from "bcrypt";
import { UserModel } from "../models";
import { userRepository } from "../repositories";
import { userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";

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
    await userService.create({ email: "mail@mail.com", password: "password" });
    expect(spy).toHaveBeenCalled();
  });

  test("should not store user's password as plain text", async () => {
    const [user, error] = await userService.create({
      email: "mail@mail.com",
      password: "password",
    });

    console.log("user-from-service-1", user); //! here user is mongo document

    expect(error).toBeNull();
    expect(user).toBeDefined();

    const userInDb = await UserModel.findOne({ email: "mail@mail.com" });

    console.log("userInDb-1", userInDb); //! here userInDb is null

    expect(userInDb).not.toBeNull();

    expect(userInDb?.password).not.toBe("password");
  });

  test("stored password in database and password was sent should match", async () => {
    const userInDbBefore = await UserModel.findOne({ email: "mail@mail.com" });

    const [user, error] = await userService.create({
      email: "mail@mail.com",
      password: "password",
    });

    console.log("user-from-service-1", user); //! here user is mongo document

    expect(error).toBeNull();
    expect(user).toBeDefined();
    const userInDb = await UserModel.findOne({ email: "mail@mail.com" });

    console.log("userInDb-2", userInDb); //! here userInDb is null

    expect(userInDb).not.toBeNull();

    const isPasswordsMatched = await bcrypt.compare(
      "password",
      userInDb!.password
    );

    expect(isPasswordsMatched).toBe(true);
  });

  // TODO Implement test to check output of userRepository.create
  test.todo("test output of userRepository.create");
});
