import "dotenv/config";
import { envSchema } from "../validation";

export const envVariables = envSchema.parse({
  port: process.env.PORT,
  databaseUri: process.env.DATABASE_URI,
  databaseName: process.env.DATABASE_NAME,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  sendEmailApiKey: process.env.SEND_EMAIL_API_KEY,
  sendEmailFrom: process.env.SEND_EMAIL_FROM,
});
