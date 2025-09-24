import "dotenv/config";
import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  if (!process.env.URI) {
    throw new Error("URI is not found in process.env");
  }

  await mongoose.connect(process.env.URI);
}

export async function closeConnectionDatabase(): Promise<void> {
  await mongoose.connection.close();
}
