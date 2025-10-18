import { ERROR_MESSAGES } from "../constants";
import {
  UserInput,
  UserDocument,
  UserDocumentWithoutPassword,
  UserModel,
  FindOneUserArgs,
} from "../models";
import { ErrorData } from "../errors";

async function create(
  args: UserInput
): Promise<[UserDocumentWithoutPassword, null] | [null, ErrorData]> {
  try {
    const createdUser = await UserModel.create(args);
    const { password, ...userWithoutPassword } = createdUser.toObject();
    return [userWithoutPassword, null];
  } catch (error) {
    return [null, { errors: [ERROR_MESSAGES.USER_CREATE_REPOSITORY] }];
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
