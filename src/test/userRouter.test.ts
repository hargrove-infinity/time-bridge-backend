import express, { Express } from "express";
import request from "supertest";
import { ERROR_MESSAGES, paths, SUCCESS_MESSAGES } from "../constants";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { UserModel } from "../models";

// Import and spy on validation middleware
import { middlewares } from "../middlewares";
const spyOnValidationMiddleware = jest.spyOn(middlewares, "validate");

// Import and spy on userRoutes.create
import { userRoutes } from "../routes/userRoutes";
// Create the spy at module level, BEFORE userRouter is imported
const spyOnUserRoutesCreate = jest.spyOn(userRoutes, "create");
// Import userRouter AFTER creating a spy
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
  await closeConnectionDatabase();
});

describe("userRouter.create", () => {
  test("should call validate middleware", async () => {
    await request(app).post(paths.users.base).send({
      email: "mail@mail.com",
      password: "password",
    });
    expect(spyOnValidationMiddleware).toHaveBeenCalled();
  });

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
    expect(spyOnUserRoutesCreate).toHaveBeenCalled();
  });

  test("should receive 200 status code", async () => {
    const response = await request(app)
      .post(paths.users.base)
      .send({ email: "mail@mail.com", password: "password" });
    expect(response.status).toBe(200);
  });

  test("should respond with confirmation message when correct input is provided", async () => {
    const response = await request(app).post(paths.users.base).send({
      email: "mail@mail.com",
      password: "password",
    });
    expect(response.body).toEqual({
      payload: SUCCESS_MESSAGES.USER_SUCCESSFULLY_CREATED,
    });
  });
});
