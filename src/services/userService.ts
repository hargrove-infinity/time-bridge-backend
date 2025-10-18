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

async function create(
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

async function login(args: CreateUserInput) {
  await userRepository.findOne({ email: args.email });
}

export const userService = { create, login } as const;
