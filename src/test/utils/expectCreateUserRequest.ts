import { Express } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import { paths } from "../../constants";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";
import { expectJwtPayload } from "./expectJwtPayload";

export async function expectCreateUserRequest(app: Express): Promise<void> {
  const response = await request(app).post(paths.auth.register).send({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expect(response.body).toStrictEqual({ payload: expect.any(String) });

  const decoded = jwt.decode(response.body.payload);

  expectJwtPayload(decoded);

  expect(mongoose.Types.ObjectId.isValid(decoded._id)).toBe(true);
}
