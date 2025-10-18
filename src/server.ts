import { app } from "./app";
import { envVariables } from "./common";

const server = app.listen(envVariables.port, () => {
  console.info(`Server is running on port ${envVariables.port}`);
});

export { server };
