import jwt from "jsonwebtoken";
import { userService } from "../../services";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";
import { expectSignTokenResult } from "./expectSignTokenResult";
import { expectJwtPayload } from "./expectJwtPayload";

export async function expectLoginUserServiceReturnsValidJwt(): Promise<{
  _id: string;
  email: string;
  iat: number;
  exp: number;
}> {
  const resultUserLogin = await userService.login({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  // ! Tmp commented
  // TODO Should be refactored
  // expectSignTokenResult(resultUserLogin);
  const [token] = resultUserLogin;

  // ! Tmp added
  // TODO Should be removed
  if (!token) {
    throw new Error("Token is not defined");
  }

  const decoded = jwt.decode(token);

  expectJwtPayload(decoded);

  return decoded;
}
