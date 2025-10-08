import request from "supertest";
import { app } from "../app";
import { envVariables } from "../common";
import { paths } from "../constants";
import { UserModel } from "../models";
import { closeConnectionDatabase, connectDatabase } from "../utils";
import { verifyCreateUserRequest } from "./utils";

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await closeConnectionDatabase();
});

describe("app.ts", () => {
  test("server starts and responds", async () => {
    const server = app.listen(envVariables.port);
    const response = await request(server).get(paths.common.base);
    expect(response.status).toBe(404);
    server.close();
  });

  test("should mount the user create route", async () => {
    await verifyCreateUserRequest(app);
  });
});
