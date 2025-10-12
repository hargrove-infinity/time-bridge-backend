import { envVariables } from "../common";
import { server } from "../server";
import { SERVER_TEST_DELAY } from "./constants";
import { sleep } from "./utils";

const spy = jest.spyOn(console, "info");

afterAll(() => {
  server.close();
  spy.mockRestore();
});

describe("server.ts", () => {
  test("server listens", () => {
    expect(server.listening).toBe(true);
  });

  test("server runs on env port", () => {
    const address = server.address();

    if (address === null) {
      throw new Error("missing address");
    }

    if (typeof address === "string") {
      throw new Error("address is a string");
    }

    const port = Number(envVariables.port);

    expect(address.port).toBe(port);
  });

  test("server logs start message", async () => {
    await sleep(SERVER_TEST_DELAY);

    expect(spy).toHaveBeenCalledWith(
      `Server is running on port ${envVariables.port}`
    );
  });
});
