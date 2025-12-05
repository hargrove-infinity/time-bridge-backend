import { connection } from "mongoose";
import { connectDatabase } from "../../../utils";

export async function expectConnectDatabase(): Promise<void> {
  expect(connection.readyState).toBe(0);
  await connectDatabase();
  expect(connection.readyState).toBe(1);
}
