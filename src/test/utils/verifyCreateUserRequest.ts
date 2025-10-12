import { Express } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import { paths } from "../../constants";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";

export async function verifyCreateUserRequest(app: Express): Promise<void> {
  const response = await request(app).post(paths.users.base).send({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expect(response.body).toStrictEqual({
    payload: expect.any(String),
  });

  const decoded = jwt.decode(response.body.payload!);

  expect(typeof decoded).not.toBe("string");
  expect(typeof decoded).toBe("object");

  expect(mongoose.Types.ObjectId.isValid((decoded as JwtPayload)!._id)).toBe(
    true
  );

  expect(decoded).toStrictEqual({
    _id: expect.any(String),
    email: TEST_USER_EMAIL,
    iat: expect.any(Number),
    exp: expect.any(Number),
  });
}
