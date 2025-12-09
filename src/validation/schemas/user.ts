import { z } from "zod";
import { ERROR_DEFINITIONS, PASSWORD_MIN_LEN } from "../../constants";

export const emailValidationSchema = z.object({
  email: z.email(ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code),
});

export const userValidationSchema = emailValidationSchema.extend({
  password: z
    .string(ERROR_DEFINITIONS.PASSWORD_NOT_STRING.code)
    .min(PASSWORD_MIN_LEN, ERROR_DEFINITIONS.PASSWORD_MIN_LEN_FAILED.code)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      ERROR_DEFINITIONS.PASSWORD_REQUIREMENTS_NOT_MET.code
    ),
});

export type UserInput = z.infer<typeof userValidationSchema>;

export const emailConfirmValidationSchema = emailValidationSchema.extend({
  email: z.email(ERROR_DEFINITIONS.EMAIL_INCORRECT_PATTERN.code),
  code: z
    .string(ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_NOT_STRING.code)
    .regex(
      /^\d{6}$/,
      ERROR_DEFINITIONS.EMAIL_CONFIRM_CODE_MUST_BE_6_DIGITS.code
    ),
});

export type EmailConfirmInput = z.infer<typeof emailConfirmValidationSchema>;
