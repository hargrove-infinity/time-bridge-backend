import httpMocks from "node-mocks-http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";
import { userRoutes } from "../../routes";
import { expectJwtPayload } from "./expectJwtPayload";

export async function expectLoginUserRouteReturnsValidJwt(): Promise<{
  _id: string;
  email: string;
  iat: number;
  exp: number;
}> {
  const requestLoginUser = httpMocks.createRequest({
    body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
  });
  const responseLoginUser = httpMocks.createResponse();
  await userRoutes.login(requestLoginUser, responseLoginUser);

  expect(responseLoginUser.statusCode).toBe(200);

  const dataLoginUser = responseLoginUser._getData();

  expect(typeof dataLoginUser.payload).toBe("string");

  const decodedJwt = jwt.decode(dataLoginUser.payload);

  expectJwtPayload(decodedJwt);

  expect(mongoose.Types.ObjectId.isValid(decodedJwt._id)).toBe(true);

  return decodedJwt;
}
