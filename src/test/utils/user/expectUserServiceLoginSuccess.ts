import jwt from "jsonwebtoken";
import { userService } from "../../../services";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../constants";
import { expectJwtPayload, expectSignTokenResult } from "../jwt";

export async function expectUserServiceLoginSuccess(): Promise<{
  _id: string;
  email: string;
  iat: number;
  exp: number;
}> {
  const resultUserLogin = await userService.login({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expectSignTokenResult(resultUserLogin);
  const [token] = resultUserLogin;

  const decoded = jwt.decode(token);

  expectJwtPayload(decoded);

  return decoded;
}
