import { connection } from "mongoose";
import { CONNECTED_TO_DATABASE_SUCCESSFULLY } from "../constants";
import { connectDatabase, closeConnectionDatabase } from "../utils";
import { expectConnectDatabase } from "./utils";

const spyOnConsoleInfo = jest.spyOn(console, "info");

afterEach(async () => {
  await closeConnectionDatabase();
});

afterAll(async () => {
  spyOnConsoleInfo.mockRestore();
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
    expect(connection.readyState).toBe(0);
  });

  test("connectDatabase() is idempotent if called multiple times", async () => {
    await expectConnectDatabase();
    await connectDatabase();
    expect(connection.readyState).toBe(1);
  });
});
