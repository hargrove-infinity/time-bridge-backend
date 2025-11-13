import { z } from "zod";
import { ERROR_DEFINITIONS } from "../../constants";

export const userValidationSchema = z.object({
  email: z
    .string(ERROR_DEFINITIONS.EMAIL_UNDEFINED.code)
    .min(1, ERROR_DEFINITIONS.EMAIL_EMPTY.code)
    .email(ERROR_DEFINITIONS.EMAIL_INVALID.code),
  password: z
    .string(ERROR_DEFINITIONS.PASSWORD_UNDEFINED.code)
    .min(6, ERROR_DEFINITIONS.PASSWORD_LENGTH.code),
});

export type CreateUserInput = z.infer<typeof userValidationSchema>;
