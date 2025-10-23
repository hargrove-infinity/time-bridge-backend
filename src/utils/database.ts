import { connection, connect } from "mongoose";
import { envVariables } from "../common";

export async function connectDatabase(): Promise<void> {
  const { readyState } = connection;

  if (readyState === 1 || readyState === 2) {
    return;
  }

  try {
    await connect(envVariables.databaseUri);
    console.info("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function closeConnectionDatabase(): Promise<void> {
  if (connection.readyState !== 0) {
    try {
      await connection.close();
      console.info("🔌 Disconnected from MongoDB");
    } catch (error) {
      console.error("🛑 Failed to close MongoDB connection:", error);
    }
  }
}
