import { UserInput, UserDocument, UserModel, FindOneUserArgs } from "../models";

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

async function findOne(
  args: FindOneUserArgs
): Promise<[UserDocument | null, null] | [null, unknown]> {
  try {
    const foundUser = await UserModel.findOne(args);
    return [foundUser, null];
  } catch (error) {
    return [null, error];
  }
}

export const userRepository = { create, findOne } as const;
