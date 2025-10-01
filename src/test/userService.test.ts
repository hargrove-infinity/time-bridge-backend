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
  await UserModel.deleteMany({});
  await closeConnectionDatabase();
});

describe("userService.create", () => {
  test("should call userRepository.create", () => {
    const spy = jest.spyOn(userRepository, "create");
    userService.create({ email: "mail@mail.com", password: "password" });
    expect(spy).toHaveBeenCalled();
  });

  // TODO Implement test to check output of userRepository.create
  test.todo("test output of userRepository.create");
});
