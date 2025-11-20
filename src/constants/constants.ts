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

export const ZOD_ISSUE_MESSAGE_EXPECTED_OBJECT_UNDEFINED =
  "expected object, received undefined";

const ERROR_DEFINITIONS_MISC = {
  UNKNOWN_ERROR: {
    code: "UNKNOWN_ERROR",
    description: "Error without certain definition",
  },
  UNKNOWN_ERROR_KEY: {
    code: "UNKNOWN_ERROR_KEY",
    description: "Error without defined error key",
  },
  REQUEST_BODY_MISSING: {
    code: "REQUEST_BODY_MISSING",
    description: "Request body is missing in case when it is required",
  },
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    description: "Internal Server Error",
  },
};

const ERROR_DEFINITIONS_BCRYPT = {
  INVALID_SALT_HASHING_STRING: {
    code: "INVALID_SALT_HASHING_STRING",
    description: "Invalid salt for hashing string",
  },
  ROUNDS_NEGATIVE: {
    code: "ROUNDS_NEGATIVE",
    description: "Rounds can't be negative number",
  },
  ROUNDS_LESS_THAN_ONE: {
    code: "ROUNDS_LESS_THAN_ONE",
    description: "Rounds can't be less than one",
  },
  ERROR_HASHING_STRING: {
    code: "ERROR_HASHING_STRING",
    description: "Error during hashing string",
  },
  ERROR_COMPARING_HASH_STRING: {
    code: "ERROR_COMPARING_HASH_STRING",
    description: "Error during comparing data with encrypted",
  },
};

const ERROR_DEFINITIONS_JWT = {
  ERROR_SIGNING_TOKEN: {
    code: "ERROR_SIGNING_TOKEN",
    description: "Error during signing token",
  },
  ERROR_VERIFYING_TOKEN: {
    code: "ERROR_VERIFYING_TOKEN",
    description: "Error during verifying token",
  },
  EXPIRES_IN_LESS_THAN_ONE: {
    code: "EXPIRES_IN_LESS_THAN_ONE",
    description: "expiresIn must be greater than 1 or 1",
  },
  EXPIRES_IN_NEGATIVE: {
    code: "EXPIRES_IN_NEGATIVE",
    description: "expiresIn can't be negative",
  },
  TOKEN_EXPIRED: {
    code: "TOKEN_EXPIRED",
    description: "Token has been expired",
  },
};

const ERROR_DEFINITIONS_USER_REPOSITORY = {
  CREATE_USER_DATABASE_ERROR: {
    code: "CREATE_USER_DATABASE_ERROR",
    description: "Error during creation user in database",
  },
  FIND_ONE_USER_DATABASE_ERROR: {
    code: "FIND_ONE_USER_DATABASE_ERROR",
    description: "Error during find one user in database",
  },
};

const ERROR_DEFINITIONS_USER_SERVICE = {
  LOGIN_FAILED: {
    code: "LOGIN_FAILED",
    description: "Login failed. Please check your credentials.",
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
  ...ERROR_DEFINITIONS_BCRYPT,
  ...ERROR_DEFINITIONS_JWT,
  ...ERROR_DEFINITIONS_USER_REPOSITORY,
  ...ERROR_DEFINITIONS_USER_SERVICE,
  ...ERROR_DEFINITIONS_AUTH,
};
