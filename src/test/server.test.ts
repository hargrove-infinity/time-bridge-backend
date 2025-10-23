import { connection } from "mongoose";
import { envVariables } from "../common";
import { startServer } from "../server";
import { closeConnectionDatabase } from "../utils";
import { SERVER_TEST_DELAY } from "./constants";
import { expectServerAddressInfo, sleep } from "./utils";
import * as databaseUtils from "../utils/database";

const spyOnConsoleInfo = jest.spyOn(console, "info");
const spyOnConnectDatabase = jest.spyOn(databaseUtils, "connectDatabase");

let server: import("http").Server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await closeConnectionDatabase();
  server.close();
  spyOnConsoleInfo.mockRestore();
  spyOnConnectDatabase.mockRestore();
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

  test("should connect to database inside startServer function", async () => {
    expect(spyOnConnectDatabase).toHaveBeenCalled();
    expect(connection.readyState).toBe(1);
  });

  test("server logs start message", async () => {
    await sleep(SERVER_TEST_DELAY);

    expect(spyOnConsoleInfo).toHaveBeenCalledWith(
      `Server is running on port ${envVariables.port}`
    );
  });
});
