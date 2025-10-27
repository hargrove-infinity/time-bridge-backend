import { connection, connect } from "mongoose";
import { envVariables } from "../common";
import {
  CONNECTED_TO_DATABASE_FAILED,
  CONNECTED_TO_DATABASE_SUCCESSFULLY,
  DISCONNECTED_FROM_DATABASE_FAILED,
  DISCONNECTED_FROM_DATABASE_SUCCESSFULLY,
} from "../constants";

export async function connectDatabase(): Promise<void> {
  const { readyState } = connection;

  if (readyState === 1 || readyState === 2) {
    return;
  }

  try {
    await connect(envVariables.databaseUri);
    console.info(CONNECTED_TO_DATABASE_SUCCESSFULLY);
  } catch (error) {
    console.error(CONNECTED_TO_DATABASE_FAILED, error);
    throw error;
  }
}

export async function closeConnectionDatabase(): Promise<void> {
  if (connection.readyState !== 0) {
    try {
      await connection.close();
      console.info(DISCONNECTED_FROM_DATABASE_SUCCESSFULLY);
    } catch (error) {
      console.error(DISCONNECTED_FROM_DATABASE_FAILED, error);
    }
  }
}
