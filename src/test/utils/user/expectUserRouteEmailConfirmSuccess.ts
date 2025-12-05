import httpMocks from "node-mocks-http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TEST_USER_EMAIL } from "../../constants";
import { userRoutes } from "../../../routes";
import { expectJwtPayload } from "../jwt";

export async function expectUserRouteEmailConfirmSuccess(
  emailConfirmationCode: String
): Promise<{
  _id: string;
  email: string;
  iat: number;
  exp: number;
}> {
  const requestEmailConfirm = httpMocks.createRequest({
    body: { email: TEST_USER_EMAIL, code: emailConfirmationCode },
  });
  const responseEmailConfirm = httpMocks.createResponse();

  await userRoutes.emailConfirm(requestEmailConfirm, responseEmailConfirm);

  expect(responseEmailConfirm.statusCode).toBe(200);

  const dataEmailConfirm = responseEmailConfirm._getData();

  expect(typeof dataEmailConfirm.payload).toBe("string");

  const decodedJwt = jwt.decode(dataEmailConfirm.payload);

  expectJwtPayload(decodedJwt);

  expect(mongoose.Types.ObjectId.isValid(decodedJwt._id)).toBe(true);

  return decodedJwt;
}
