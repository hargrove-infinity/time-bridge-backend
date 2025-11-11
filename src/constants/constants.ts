import { Algorithm } from "jsonwebtoken";
import { StringValue } from "ms";

export const CONNECTED_TO_DATABASE_SUCCESSFULLY = "✅ Connected to MongoDB";
export const CONNECTED_TO_DATABASE_FAILED = "❌ Failed to connect to MongoDB:";
export const DISCONNECTED_FROM_DATABASE_SUCCESSFULLY =
  "🔌 Disconnected from MongoDB";
export const DISCONNECTED_FROM_DATABASE_FAILED =
  "🛑 Failed to close MongoDB connection:";
export const SERVER_STARTED_SUCCESSFULLY = "Server is running on port";
export const SERVER_START_FAILED = "🚫 Failed to start server:";

export const DEFAULT_EXPIRES_IN_TOKEN_STRING: StringValue = "3h";
export const DEFAULT_EXPIRES_IN_TOKEN_NUMBER = 3;
export const DEFAULT_ALGORITHM_TOKEN: Algorithm = "HS256";

export const ONE_HOUR_IN_SECONDS = 3600;

export const ERROR_MESSAGES = {
  // USER CREATION
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

const ERROR_DEFINITIONS_MISC = {
  UNKNOWN_ERROR: {
    code: "UNKNOWN_ERROR",
    description: "Error without certain definition",
  },
};

const ERROR_DEFINITIONS_AUTH = {
  AUTH_BODY_UNDEFINED: {
    code: "AUTH_BODY_UNDEFINED",
    description: "Validation error. Request body is not passed.",
  },
  EMAIL_UNDEFINED: {
    code: "EMAIL_UNDEFINED",
    description: "Validation error. Email field is missing.",
  },
  EMAIL_EMPTY: {
    code: "EMAIL_EMPTY",
    description: "Validation error. Email field is empty string.",
  },
  EMAIL_INVALID: {
    code: "EMAIL_INVALID",
    description: "Validation error. Email field is invalid.",
  },
  PASSWORD_UNDEFINED: {
    code: "PASSWORD_UNDEFINED",
    description: "Validation error. Password field is missing.",
  },
  PASSWORD_LENGTH: {
    code: "PASSWORD_LENGTH",
    description: "Validation error. Password field is less than 6 characters.",
  },
};

export const ERROR_DEFINITIONS = {
  ...ERROR_DEFINITIONS_MISC,
  ...ERROR_DEFINITIONS_AUTH,
};
