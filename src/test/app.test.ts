import request from "supertest";
import { app } from "../app";
import { paths } from "../constants";
import { listRoutes } from "./utils";

describe("app server", () => {
  test("server starts and responds", async () => {
    const server = app.listen(process.env.PORT);
    const response = await request(server).get(paths.common.base);
    expect(response.status).toBe(404);
    server.close();
  });

  // TODO Implement test to check if router is mounted
  // TODO Use app.router.stack for this
  test("should mount user router to /users", () => {
    const routes = listRoutes(app);

    expect(routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: paths.users.base,
          methods: expect.arrayContaining(["post"]),
        }),
      ])
    );
  });
});
