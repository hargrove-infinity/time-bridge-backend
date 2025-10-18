import mongoose from "mongoose";
import { envVariables } from "../common";

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoose.connection.readyState === 2) {
    return;
  }

  await mongoose.connect(envVariables.databaseUri);
}

export async function closeConnectionDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}
