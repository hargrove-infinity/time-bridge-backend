import { ERROR_DEFINITIONS } from "../constants";
import { ApplicationError } from "../errors";
import {
  CreateUserArgs,
  FindOneUserArgs,
  UserDocument,
  UserDocumentWithoutPassword,
  UserModel,
} from "../models";

async function create(
  args: CreateUserArgs
): Promise<[UserDocumentWithoutPassword, null] | [null, ApplicationError]> {
  try {
    const createdUser = await UserModel.create(args);
    const { password, ...userWithoutPassword } = createdUser.toObject();
    return [userWithoutPassword, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.CREATE_USER_DATABASE_ERROR,
        statusCode: 500,
      }),
    ];
  }
}

async function findOne(
  args: FindOneUserArgs
): Promise<[UserDocument | null, null] | [null, unknown]> {
  try {
    const foundUser = await UserModel.findOne(args);
    return [foundUser, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.FIND_ONE_USER_DATABASE_ERROR,
        statusCode: 500,
      }),
    ];
  }
}

export const userRepository = { create, findOne } as const;
