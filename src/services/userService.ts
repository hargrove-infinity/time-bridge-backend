import bcrypt from "bcrypt";
import { userRepository } from "../repositories";
import { IUserCreateDto } from "../types";

async function create(dto: IUserCreateDto) {
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const data = await userRepository.create({
    email: dto.email,
    password: hashedPassword,
  });

  return data;
}

export const userService = { create } as const;
