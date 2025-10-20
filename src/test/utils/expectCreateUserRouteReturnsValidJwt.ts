import httpMocks from "node-mocks-http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { userRoutes } from "../../routes";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";
import { expectJwtPayload } from "./expectJwtPayload";

export async function expectCreateUserRouteReturnsValidJwt(): Promise<void> {
  const requestCreateUser = httpMocks.createRequest({
    body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
  });
  const responseCreateUser = httpMocks.createResponse();
  await userRoutes.create(requestCreateUser, responseCreateUser);

  expect(responseCreateUser.statusCode).toBe(200);

  const dataCreateUser = responseCreateUser._getData();

  expect(typeof dataCreateUser.payload).toBe("string");

  const decodedJwt = jwt.decode(dataCreateUser.payload);

  expectJwtPayload(decodedJwt);

  expect(mongoose.Types.ObjectId.isValid(decodedJwt._id)).toBe(true);
}
