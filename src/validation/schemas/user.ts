import { z } from "zod";
import { ERROR_DEFINITIONS } from "../../constants";

export const userObject = z.object({
  email: z
    .string(ERROR_DEFINITIONS.EMAIL_UNDEFINED.code)
    .min(1, ERROR_DEFINITIONS.EMAIL_EMPTY.code)
    .email(ERROR_DEFINITIONS.EMAIL_INVALID.code),
  password: z
    .string(ERROR_DEFINITIONS.PASSWORD_UNDEFINED.code)
    .min(6, ERROR_DEFINITIONS.PASSWORD_LENGTH.code),
});

export type CreateUserInput = z.infer<typeof userObject>;

export const userValidationSchema = z
  .any()
  .refine((val) => val !== undefined && val !== null, {
    message: ERROR_DEFINITIONS.AUTH_BODY_UNDEFINED.code,
  })
  .pipe(userObject);
