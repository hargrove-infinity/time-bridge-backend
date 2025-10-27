import mongoose from "mongoose";
import {
  CONNECTED_TO_DATABASE_FAILED,
  CONNECTED_TO_DATABASE_SUCCESSFULLY,
  DISCONNECTED_FROM_DATABASE_FAILED,
  DISCONNECTED_FROM_DATABASE_SUCCESSFULLY,
} from "../constants";
import { connectDatabase, closeConnectionDatabase } from "../utils";
import { expectConnectDatabase } from "./utils";

const spyOnConsoleInfo = jest.spyOn(console, "info");
let spyOnConsoleError = jest.spyOn(console, "error");

afterEach(async () => {
  await closeConnectionDatabase();
  jest.clearAllMocks();
});

afterAll(async () => {
  spyOnConsoleInfo.mockRestore();
  spyOnConsoleError.mockRestore();
});

describe("database connection / disconnection", () => {
  test("connectDatabase() establishes a connection", async () => {
    await expectConnectDatabase();
    expect(spyOnConsoleInfo).toHaveBeenCalledWith(
      CONNECTED_TO_DATABASE_SUCCESSFULLY
    );
  });

  test("closeConnectionDatabase() closes the connection", async () => {
    await expectConnectDatabase();
    await closeConnectionDatabase();
    expect(mongoose.connection.readyState).toBe(0);
    expect(spyOnConsoleInfo).toHaveBeenCalledWith(
      DISCONNECTED_FROM_DATABASE_SUCCESSFULLY
    );
  });

  test("connectDatabase() is idempotent if called multiple times", async () => {
    await expectConnectDatabase();
    await connectDatabase();
    expect(mongoose.connection.readyState).toBe(1);
  });

  test("should handle mongoose connection failure", async () => {
    const mockError = new Error("Database connection failed");

    spyOnConsoleError.mockImplementation(() => {});

    const spyOnMongooseConnect = jest
      .spyOn(mongoose, "connect")
      .mockRejectedValueOnce(mockError);

    await expect(connectDatabase()).rejects.toThrow(mockError);

    expect(spyOnConsoleError).toHaveBeenCalledWith(
      CONNECTED_TO_DATABASE_FAILED,
      mockError
    );

    spyOnMongooseConnect.mockRestore();

    spyOnConsoleError.mockRestore();

    spyOnConsoleError = jest.spyOn(console, "error");
  });

  test("should handle mongoose disconnection failure", async () => {
    const mockError = new Error("Database disconnection failed");

    await expectConnectDatabase();

    spyOnConsoleError.mockImplementation(() => {});

    const spyOnMongooseConnect = jest
      .spyOn(mongoose.connection, "close")
      .mockRejectedValueOnce(mockError);

    await closeConnectionDatabase();

    expect(spyOnConsoleError).toHaveBeenCalledWith(
      DISCONNECTED_FROM_DATABASE_FAILED,
      mockError
    );

    spyOnMongooseConnect.mockRestore();

    spyOnConsoleError.mockRestore();

    spyOnConsoleError = jest.spyOn(console, "error");
  });
});
