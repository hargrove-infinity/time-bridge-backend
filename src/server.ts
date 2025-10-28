import { app } from "./app";
import { envVariables } from "./common";
import { SERVER_START_FAILED, SERVER_STARTED_SUCCESSFULLY } from "./constants";
import { connectDatabase } from "./utils";

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(envVariables.port, () => {
      console.info(`${SERVER_STARTED_SUCCESSFULLY} ${envVariables.port}`);
    });

    return server;
  } catch (error) {
    console.error(SERVER_START_FAILED, error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { startServer };
