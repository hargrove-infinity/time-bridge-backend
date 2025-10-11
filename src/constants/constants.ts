export const ERROR_MESSAGES = {
  // USER CREATE
  USER_CREATION_BODY_UNDEFINED: "User creation body undefined",
  EMAIL_UNDEFINED: "Email undefined",
  EMAIL_EMPTY: "Empty email",
  EMAIL_INVALID: "Email invalid",
  PASSWORD_UNDEFINED: "Password undefined",
  PASSWORD_LENGTH: "Password must be 6 chars",
  USER_CREATE_ROUTE: "Some error occurred in user create route",
  // JWT
  ERROR_SIGNING_TOKEN: "Error during signing token",
  ERROR_VERIFYING_TOKEN: "Error during verifying token",
  EXPIRES_IN_LESS_THAN_ONE: "expiresIn must be greater than 1 or 1",
  EXPIRES_IN_NEGATIVE: "expiresIn can't be negative",
  TOKEN_EXPIRED: "Token has been expired",
  INVALID_PAYLOAD_SIGN_IN_TOKEN: "Payload is invalid for sign token",
  EXPIRES_IN_NULL: "expiresIn can't be null",
  EXPIRES_IN_UNDEFINED: "expiresIn can't be undefined",
  EXPIRES_IN_WRONG_FORMAT: "expiresIn has wrong format",
  ERROR_TOKEN_SIGNATURE_ALGORITHM:
    "algorithm must be a valid string enum value",
};

export const SUCCESS_MESSAGES = {
  USER_SUCCESSFULLY_CREATED: "User successfully created",
};

export const SERVER_TEST_DELAY = 1000;
