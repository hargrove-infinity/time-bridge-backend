import httpMocks from "node-mocks-http";
import { UserModel } from "../models";
import { userRoutes } from "../routes";
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

  // TODO Implement test to check correctness of status code
  test.todo(
    "same test as test from service to check if response has correct JWT"
  );
});
