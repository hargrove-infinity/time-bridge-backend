import "dotenv/config";
import { envSchema } from "../validation";

export const envVariables = envSchema.parse({
  port: process.env.PORT,
  databaseUri: process.env.DATABASE_URI,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
});
