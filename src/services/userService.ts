import {
  DEFAULT_ALGORITHM_TOKEN,
  DEFAULT_EXPIRES_IN_TOKEN_STRING,
  ERROR_DEFINITIONS,
} from "../constants";
import { userRepository } from "../repositories";
import { ApplicationError } from "../errors";
import { CreateUserInput } from "../validation";
import { jwtService } from "./jwt";
import { bcryptService } from "./bcrypt";

async function register(
  args: CreateUserInput
): Promise<[string, null] | [null, ApplicationError]> {
  const [hash, errorHash] = await bcryptService.hash({ data: args.password });

  if (errorHash) {
    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.code,
        errorDescription: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.description,
        statusCode: 500,
      }),
    ];
  }

  const [user, errorCreateUser] = await userRepository.create({
    email: args.email,
    password: hash,
  });

  if (errorCreateUser) {
    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.code,
        errorDescription: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.description,
        statusCode: 500,
      }),
    ];
  }

  const [token, errorSignToken] = jwtService.sign({
    payload: { _id: user._id, email: user.email },
    options: {
      algorithm: DEFAULT_ALGORITHM_TOKEN,
      expiresIn: DEFAULT_EXPIRES_IN_TOKEN_STRING,
    },
  });

  if (errorSignToken) {
    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.code,
        errorDescription: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.description,
        statusCode: 500,
      }),
    ];
  }

  return [token, null];
}

async function login(
  args: CreateUserInput
): Promise<[string, null] | [null, ApplicationError]> {
  const [foundUser, errorFindUser] = await userRepository.findOne({
    email: args.email,
  });

  if (errorFindUser) {
    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.code,
        errorDescription: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.description,
        statusCode: 500,
      }),
    ];
  }

  if (!foundUser) {
    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.LOGIN_FAILED.code,
        errorDescription: ERROR_DEFINITIONS.LOGIN_FAILED.description,
        statusCode: 400,
      }),
    ];
  }

  const [isMatched, errorCompare] = await bcryptService.compare({
    data: args.password,
    encrypted: foundUser.password,
  });

  if (errorCompare) {
    return [null, errorCompare];
  }

  if (!isMatched) {
    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.LOGIN_FAILED.code,
        errorDescription: ERROR_DEFINITIONS.LOGIN_FAILED.description,
        statusCode: 400,
      }),
    ];
  }

  const [token, errorSignToken] = jwtService.sign({
    payload: { _id: foundUser._id, email: foundUser.email },
    options: {
      algorithm: DEFAULT_ALGORITHM_TOKEN,
      expiresIn: DEFAULT_EXPIRES_IN_TOKEN_STRING,
    },
  });

  if (errorSignToken) {
    return [null, errorSignToken];
  }

  return [token, null];
}

export const userService = { register, login } as const;
