import { Express } from "express";
import request from "supertest";
import { paths, SUCCESS_MESSAGES } from "../../constants";

export async function verifyCreateUserRequest(app: Express): Promise<void> {
  const response = await request(app).post(paths.users.base).send({
    email: "mail@mail.com",
    password: "password",
  });

  expect(response.body).toEqual({
    payload: SUCCESS_MESSAGES.USER_SUCCESSFULLY_CREATED,
  });

  // TODO
  // TODO body should include JWT
}
