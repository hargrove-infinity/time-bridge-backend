import bcrypt from "bcrypt";
import { ERROR_MESSAGES } from "../constants";
import { userRepository } from "../repositories";
import { ErrorData } from "../types";
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
    options: { algorithm: "HS256", expiresIn: "3h" },
  });

  if (errorSignToken) {
    return [null, { errors: [ERROR_MESSAGES.USER_CREATE_SERVICE] }];
  }

  return [token, null];
}

export const userService = { create } as const;
