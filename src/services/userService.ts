import { userRepository } from "../repositories";
import { IUserCreateDto } from "../types";

async function create(dto: IUserCreateDto) {
  const data = await userRepository.create(dto);
  return data;
}

export const userService = { create } as const;
