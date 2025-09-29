import "dotenv/config";
import { app } from "./app";

const server = app.listen(process.env.PORT, () => {
  console.info(`Server is running on port ${process.env.PORT}`);
});

export { server };
