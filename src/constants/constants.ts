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

export const DEFAULT_HASHING_ROUNDS = 10;

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

  // BCRYPT
  INVALID_SALT_HASHING_STRING: "Invalid salt for hashing string",
  ROUNDS_NEGATIVE: "Rounds can't be negative number",
  ROUNDS_LESS_THAN_ONE: "Rounds can't be less than one",
  ERROR_HASHING_STRING: "Error during hashing string",
  ERROR_COMPARING_HASH_STRING: "Error during comparing data with encrypted",

  // MISC
  INTERNAL_SERVER_ERROR: "Internal server error",
};
