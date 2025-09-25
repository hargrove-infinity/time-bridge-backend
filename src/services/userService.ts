import { userRepository } from "../repositories";

async function create() {
  // @ts-ignore
  userRepository.create();
}

export const userService = { create } as const;
