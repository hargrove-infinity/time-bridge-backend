import mongoose from "mongoose";
import {
  CONNECTED_TO_DATABASE_FAILED,
  CONNECTED_TO_DATABASE_SUCCESSFULLY,
  DISCONNECTED_FROM_DATABASE_SUCCESSFULLY,
} from "../constants";
import { connectDatabase, closeConnectionDatabase } from "../utils";
import { expectConnectDatabase } from "./utils";

const spyOnConsoleInfo = jest.spyOn(console, "info");

const spyOnConsoleErrorMockImpl = jest
  .spyOn(console, "error")
  .mockImplementation();

afterEach(async () => {
  await closeConnectionDatabase();
});

afterAll(async () => {
  spyOnConsoleInfo.mockRestore();
  spyOnConsoleErrorMockImpl.mockRestore();
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

    const spyOnMongooseConnect = jest
      .spyOn(mongoose, "connect")
      .mockRejectedValueOnce(mockError);

    await expect(connectDatabase()).rejects.toThrow(mockError);

    expect(spyOnConsoleErrorMockImpl).toHaveBeenCalledWith(
      CONNECTED_TO_DATABASE_FAILED,
      mockError
    );

    spyOnMongooseConnect.mockRestore();
  });
});
