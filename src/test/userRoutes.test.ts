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
});
