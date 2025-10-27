import { userService } from "../../services";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";
import { expectTokenString } from "./expectTokenString";

export async function expectCreateUserInService(): Promise<void> {
  const [tokenCreateUser, errorCreateUser] = await userService.register({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expect(errorCreateUser).toBe(null);

  expectTokenString(tokenCreateUser);
}
