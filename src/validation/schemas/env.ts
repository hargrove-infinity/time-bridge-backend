import { z } from "zod";

export const envSchema = z.object({
  port: z.string().transform((val) => parseInt(val, 10)),
  databaseUri: z.url(),
  databaseName: z.string(),
  jwtSecretKey: z.string(),
  sendEmailApiKey: z.string(),
  sendEmailFrom: z.email(),
});
