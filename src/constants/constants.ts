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

export const PASSWORD_MIN_LEN = 8;

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
  EMAIL_INCORRECT_PATTERN: {
    code: "EMAIL_INCORRECT_PATTERN",
    description: "Validation error. Email is undefined, empty, or invalid.",
  },
  PASSWORD_NOT_STRING: {
    code: "PASSWORD_NOT_STRING",
    description: "Validation error. Password must be a valid string.",
  },
  PASSWORD_MIN_LEN_FAILED: {
    code: "PASSWORD_MIN_LEN_FAILED",
    description: `Validation error. Password does not meet the minimum length requirement: ${PASSWORD_MIN_LEN} characters.`,
  },
  PASSWORD_REQUIREMENTS_NOT_MET: {
    code: "PASSWORD_REQUIREMENTS_NOT_MET",
    description:
      "Validation error. Password must contain uppercase, lowercase, and numeric characters.",
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
