import express, { Express } from "express";
import request from "supertest";
import { ERROR_MESSAGES, paths, SUCCESS_MESSAGES } from "../constants";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { UserModel } from "../models";
import { userRoutes } from "../routes/userRoutes";
// Create the spy at module level, before userRouter is imported
const spy = jest.spyOn(userRoutes, "create");
import { userRouter } from "../routes/userRouter";

let app: Express;

beforeAll(async () => {
  await connectDatabase();

  app = express();
  app.use(express.json());
  app.use(paths.users.base, userRouter);
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await closeConnectionDatabase();
});

describe("userRouter.create", () => {
  test("should fail validation: body in undefined", async () => {
    const response = await request(app).post(paths.users.base).send();
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      ERROR_MESSAGES.USER_CREATION_BODY_UNDEFINED,
    ]);
  });

  test("should fail validation: email and password are undefined", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: undefined, password: undefined });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      ERROR_MESSAGES.EMAIL_UNDEFINED,
      ERROR_MESSAGES.PASSWORD_UNDEFINED,
    ]);
  });

  test("should fail validation: email is empty and invalid, password is valid", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: "", password: "password" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([
      ERROR_MESSAGES.EMAIL_EMPTY,
      ERROR_MESSAGES.EMAIL_INVALID,
    ]);
  });

  test("should fail validation: email is invalid, password is valid", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: "abc", password: "password" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([ERROR_MESSAGES.EMAIL_INVALID]);
  });

  test("should fail validation: email is valid, password is undefined", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: "mail@mail.com", password: undefined });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([ERROR_MESSAGES.PASSWORD_UNDEFINED]);
  });

  test("should fail validation: email is valid, password is invalid", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: "mail@mail.com", password: "pass" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual([ERROR_MESSAGES.PASSWORD_LENGTH]);
  });

  test("should call userRoutes.create", async () => {
    await request(app)
      .post(paths.users.base)
      .send({ email: "mail@mail.com", password: "password" });
    expect(spy).toHaveBeenCalled();
  });

  test("should receive 200 status code", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: "mail@mail.com", password: "password" });
    expect(response.status).toBe(200);
  });

  test("should receive correct payload", async () => {
    const response = await request(app).post(paths.users.base).send({
      email: "mail@mail.com",
      password: "password",
    });
    expect(response.body).toEqual({
      payload: SUCCESS_MESSAGES.USER_SUCCESSFULLY_CREATED,
    });
  });
});
