import httpMocks from "node-mocks-http";
import { userRoutes } from "../routes";
import { userService } from "../services";

describe("userRoutes.create", () => {
  test("should call userService.create", async () => {
    const spy = jest.spyOn(userService, "create");
    const request = httpMocks.createRequest();
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
