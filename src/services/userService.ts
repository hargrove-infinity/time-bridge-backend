import bcrypt from "bcrypt";
import { userRepository } from "../repositories";
import { CreateUserInput } from "../validation";

async function create(args: CreateUserInput) {
  const hashedPassword = await bcrypt.hash(args.password, 10);

  const data = await userRepository.create({
    email: args.email,
    password: hashedPassword,
  });

  return data;
}

export const userService = { create } as const;
