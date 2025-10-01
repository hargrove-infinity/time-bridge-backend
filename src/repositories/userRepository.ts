import { UserInput, UserDocument, UserModel } from "../models";

async function create(
  args: UserInput
): Promise<[UserDocument, null] | [null, unknown]> {
  try {
    const createdUser = await UserModel.create(args);
    return [createdUser, null];
  } catch (error) {
    return [null, error];
  }
}

export const userRepository = { create } as const;
