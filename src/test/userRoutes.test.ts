import httpMocks from "node-mocks-http";
import { userRoutes } from "../routes";
import { userService } from "../services";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { UserModel } from "../models";

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

describe("userRoutes.create", () => {
  test("should call userService.create", async () => {
    const spy = jest.spyOn(userService, "create");
    const request = httpMocks.createRequest({
      body: { email: "mail@mail.com", password: "password" },
    });
    const response = httpMocks.createResponse();
    await userRoutes.create(request, response);
    expect(spy).toHaveBeenCalled();
  });

  // TODO Implement test to check validation input
  test.todo("validate input");

  // TODO Implement test to check correctness of output
  test.todo("check correct output");

  // TODO Implement test to check correctness of status code
  test.todo("check correct status code");
});
