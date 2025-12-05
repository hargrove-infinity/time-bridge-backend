import { EMAIL_CONFIRMATION_STEP } from "../../../constants";
import { userService } from "../../../services";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../constants";

export async function expectUserServiceRegisterSuccess() {
  const [payloadRegisterUser, errorRegisterUser] = await userService.register({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expect(errorRegisterUser).toBe(null);

  expect(payloadRegisterUser).toEqual({
    nextStep: EMAIL_CONFIRMATION_STEP,
  });
}
