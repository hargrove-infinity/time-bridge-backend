import { connection } from "mongoose";
import { envVariables } from "../common";
import { SERVER_START_FAILED, SERVER_STARTED_SUCCESSFULLY } from "../constants";
import { startServer } from "../server";
import { closeConnectionDatabase } from "../utils";
import { SERVER_TEST_DELAY } from "./constants";
import { expectServerAddressInfo, sleep } from "./utils";
import * as databaseUtils from "../utils/database";

const spyOnConsoleInfo = jest.spyOn(console, "info");

const spyOnConsoleErrorMockImpl = jest
  .spyOn(console, "error")
  .mockImplementation();

const spyOnProcessExitMockImpl = jest
  .spyOn(process, "exit")
  .mockImplementation();

const spyOnConnectDatabase = jest.spyOn(databaseUtils, "connectDatabase");

let server: import("http").Server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await closeConnectionDatabase();
  server.close();
  spyOnConsoleInfo.mockRestore();
  spyOnConsoleErrorMockImpl.mockRestore();
  spyOnConnectDatabase.mockRestore();
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
      `${SERVER_STARTED_SUCCESSFULLY} ${envVariables.port}`
    );
  });

  test("should handle database connection failure and log error message", async () => {
    const mockError = new Error("Database connection failed");

    spyOnConnectDatabase.mockRejectedValueOnce(mockError);

    await startServer();

    expect(spyOnConsoleErrorMockImpl).toHaveBeenCalledWith(
      SERVER_START_FAILED,
      mockError
    );

    expect(spyOnProcessExitMockImpl).toHaveBeenCalledWith(1);
  });
});
