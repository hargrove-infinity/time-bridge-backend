// CODE BELOW MAKES TEST TO PASS
import express, { Express } from "express";
import request from "supertest";
import { paths } from "../constants";

const mockCreate = jest.fn();

jest.mock("../routes/userRoutes", () => ({
  userRoutes: {
    create: jest.fn().mockImplementation(async (req, res) => {
      mockCreate();
      res.send("OK");
    }),
  },
}));

import { userRouter } from "../routes";

let app: Express;

beforeAll(() => {
  app = express();
  app.use(paths.users.base, userRouter);
});

describe("userRouter.create", () => {
  beforeEach(() => {
    mockCreate.mockClear();
  });

  test("should call userRoutes.create", async () => {
    await request(app).post(paths.users.base);
    expect(mockCreate).toHaveBeenCalled();
  });

  test("should receive 200 status code", async () => {
    const response = await request(app).post(paths.users.base);
    expect(response.status).toBe(200);
  });
});

//! CODE BELOW MAKES TEST TO FAIL
// import express, { Express } from "express";
// import request from "supertest";
// import { paths } from "../constants";
// import { userRouter, userRoutes } from "../routes";

// let app: Express;

// beforeAll(() => {
//   app = express();

//   app.use(paths.users.base, userRouter);
// });

// describe("userRouter.create", () => {
//   test("should call userRoutes.create", async () => {
//     const spy = jest.spyOn(userRoutes, "create");
//     await request(app).post(paths.users.base);
//     expect(spy).toHaveBeenCalled();
//   });

//   test("should receive 200 status code", async () => {
//     const response = await request(app).post(paths.users.base);
//     expect(response.status).toBe(200);
//   });
// });
