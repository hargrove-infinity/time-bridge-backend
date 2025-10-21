import { envVariables } from "../common";
import { startServer } from "../server";
import { closeConnectionDatabase } from "../utils";
import { SERVER_TEST_DELAY } from "./constants";
import { expectServerAddressInfo, sleep } from "./utils";

const spy = jest.spyOn(console, "info");

let server: import("http").Server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await closeConnectionDatabase();
  server.close();
  spy.mockRestore();
});

describe("server.ts", () => {
  test("server listens", () => {
    expect(server.listening).toBe(true);
  });

  test("server runs on env port", () => {
    const address = server.address();
    expectServerAddressInfo(address);
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
