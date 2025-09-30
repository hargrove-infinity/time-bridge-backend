import { z } from "zod";
import { ERROR_MESSAGES } from "../../constants";

export const userObject = z.object({
  email: z
    .string(ERROR_MESSAGES.EMAIL_UNDEFINED)
    .min(1, ERROR_MESSAGES.EMAIL_EMPTY)
    .email(ERROR_MESSAGES.EMAIL_INVALID),
  password: z
    .string(ERROR_MESSAGES.PASSWORD_UNDEFINED)
    .min(6, ERROR_MESSAGES.PASSWORD_LENGTH),
});

export const userValidationSchema = z
  .any()
  .refine((val) => val !== undefined && val !== null, {
    message: ERROR_MESSAGES.USER_CREATION_BODY_UNDEFINED,
  })
  .pipe(userObject);
