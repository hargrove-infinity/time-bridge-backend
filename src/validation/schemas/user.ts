import { z } from "zod";
import { ERROR_DEFINITIONS, PASSWORD_MIN_LEN } from "../../constants";

export const userValidationSchema = z.object({
  email: z.email(ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code),
  password: z
    .string(ERROR_DEFINITIONS.PASSWORD_NOT_STRING.code)
    .min(PASSWORD_MIN_LEN, ERROR_DEFINITIONS.PASSWORD_MIN_LEN_FAILED.code)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      ERROR_DEFINITIONS.PASSWORD_REQUIREMENTS_NOT_MET.code
    ),
});

export type CreateUserInput = z.infer<typeof userValidationSchema>;
