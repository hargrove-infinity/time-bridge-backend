import bcrypt from "bcrypt";
import {
  DEFAULT_ALGORITHM_TOKEN,
  DEFAULT_EXPIRES_IN_TOKEN_STRING,
  ERROR_MESSAGES,
} from "../constants";
import { userRepository } from "../repositories";
import { ErrorData } from "../errors";
import { CreateUserInput } from "../validation";
import { jwtService } from "./jwt";

async function register(
  args: CreateUserInput
): Promise<[string, null] | [null, ErrorData]> {
  const hashedPassword = await bcrypt.hash(args.password, 10);

  const [user, errorCreateUser] = await userRepository.create({
    email: args.email,
    password: hashedPassword,
  });

  if (errorCreateUser) {
    return [null, { errors: [ERROR_MESSAGES.USER_CREATE_SERVICE] }];
  }

  const [token, errorSignToken] = jwtService.sign({
    payload: { _id: user._id, email: user.email },
    options: {
      algorithm: DEFAULT_ALGORITHM_TOKEN,
      expiresIn: DEFAULT_EXPIRES_IN_TOKEN_STRING,
    },
  });

  if (errorSignToken) {
    return [null, { errors: [ERROR_MESSAGES.USER_CREATE_SERVICE] }];
  }

  return [token, null];
}

async function login(
  args: CreateUserInput
): Promise<[string, null] | [null, ErrorData]> {
  const [foundUser, errorFindUser] = await userRepository.findOne({
    email: args.email,
  });

  if (errorFindUser) {
    return [null, { errors: [ERROR_MESSAGES.INTERNAL_SERVER_ERROR] }];
  }

  if (!foundUser) {
    return [null, { errors: [ERROR_MESSAGES.USER_EMAIL_NOT_EXIST] }];
  }

  const isPasswordsMatched = await bcrypt.compare(
    args.password,
    foundUser.password
  );

  if (!isPasswordsMatched) {
    return [null, { errors: [ERROR_MESSAGES.USER_PASSWORD_WRONG] }];
  }

  const [token, errorSignToken] = jwtService.sign({
    payload: { _id: foundUser._id, email: foundUser.email },
    options: {
      algorithm: DEFAULT_ALGORITHM_TOKEN,
      expiresIn: DEFAULT_EXPIRES_IN_TOKEN_STRING,
    },
  });

  if (errorSignToken) {
    return [null, { errors: [ERROR_MESSAGES.USER_LOGIN_SERVICE] }];
  }

  return [token, null];
}

export const userService = { register, login } as const;
