import { userRepository } from "../repositories";
import { userService } from "../services";

describe("userService.create", () => {
  test("should call userRepository.create", () => {
    const spy = jest.spyOn(userRepository, "create");
    userService.create();
    expect(spy).toHaveBeenCalled();
  });
});
