import { Express } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import { paths } from "../../constants";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";
import { expectToFulfillJwtPayload } from "./expectToFulfillJwtPayload";

export async function expectToFulfillCreateUserRequest(
  app: Express
): Promise<void> {
  const response = await request(app).post(paths.users.base).send({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expect(response.body).toStrictEqual({ payload: expect.any(String) });

  const decoded = jwt.decode(response.body.payload);

  expectToFulfillJwtPayload(decoded);

  expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
}
