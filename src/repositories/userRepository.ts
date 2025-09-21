import bcrypt from "bcrypt";
import { UserModel } from "../models";

async function create(args: { email: string; password: string }) {
  const { email, password } = args;

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await UserModel.create({
    email,
    password: hashedPassword,
  });

  return createdUser;
}

export const userRepository = { create } as const;
