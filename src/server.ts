import { app } from "./app";
import { envVariables } from "./common";
import { connectDatabase } from "./utils";

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(envVariables.port, () => {
      console.info(`Server is running on port ${envVariables.port}`);
    });

    return server;
  } catch (error) {
    console.error("🚫 Failed to start server:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { startServer };
