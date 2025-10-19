import { Algorithm } from "jsonwebtoken";
import { StringValue } from "ms";

export const DEFAULT_EXPIRES_IN_TOKEN_STRING: StringValue = "3h";
export const DEFAULT_EXPIRES_IN_TOKEN_NUMBER = 3;
export const DEFAULT_ALGORITHM_TOKEN: Algorithm = "HS256";

export const ONE_HOUR_IN_SECONDS = 3600;

export const ERROR_MESSAGES = {
  // USER CREATION
  USER_CREATION_BODY_UNDEFINED: "User creation body undefined",
  EMAIL_UNDEFINED: "Email undefined",
  EMAIL_EMPTY: "Empty email",
  EMAIL_INVALID: "Email invalid",
  PASSWORD_UNDEFINED: "Password undefined",
  PASSWORD_LENGTH: "Password must be 6 chars",
  USER_CREATE_REPOSITORY: "Some error occurred in user create repository",
  USER_CREATE_SERVICE: "Some error occurred in user create service",
  USER_CREATE_ROUTE: "Some error occurred in user create route",

  // USER LOGIN
  USER_EMAIL_NOT_EXIST: "User with provided email does not exist",
  USER_PASSWORD_WRONG: "Provided password is wrong",
  USER_LOGIN_SERVICE: "Some error occurred in user login service",
  USER_LOGIN_ROUTE: "Some error occurred in user login route",

  // JWT
  ERROR_SIGNING_TOKEN: "Error during signing token",
  ERROR_VERIFYING_TOKEN: "Error during verifying token",
  EXPIRES_IN_LESS_THAN_ONE: "expiresIn must be greater than 1 or 1",
  EXPIRES_IN_NEGATIVE: "expiresIn can't be negative",
  TOKEN_EXPIRED: "Token has been expired",

  // MISC
  INTERNAL_SERVER_ERROR: "Internal server error",
};
