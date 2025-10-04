import "dotenv/config";
import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  if (!process.env.URI) {
    throw new Error("URI is not found in process.env");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoose.connection.readyState === 2) {
    return;
  }

  await mongoose.connect(process.env.URI);
}

export async function closeConnectionDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}
