import { connection } from "mongoose";
import { connectDatabase, closeConnectionDatabase } from "../utils";
import { expectConnectDatabase } from "./utils";

afterEach(async () => {
  await closeConnectionDatabase();
});

describe("database connection / disconnection", () => {
  test("connectDatabase() establishes a connection", async () => {
    await expectConnectDatabase();
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
