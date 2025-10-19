import { ERROR_MESSAGES } from "../constants";
import { ErrorData } from "../errors";
import {
  CreateUserArgs,
  FindOneUserArgs,
  UserDocument,
  UserDocumentWithoutPassword,
  UserModel,
} from "../models";

async function create(
  args: CreateUserArgs
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

    if (foundUser) {
      return [foundUser, null];
    }

    return [foundUser, null];
  } catch (error) {
    return [null, error];
  }
}

export const userRepository = { create, findOne } as const;
