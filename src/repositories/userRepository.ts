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
    // ! Tmp passed password as an object to cause mongodb error
    // TODO Should be removed
    const createdUser = await UserModel.create({
      ...args,
      password: { key: 1 },
    });
    const { password, ...userWithoutPassword } = createdUser.toObject();
    return [userWithoutPassword, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.CREATE_USER_DATABASE_ERROR.code,
        errorDescription:
          ERROR_DEFINITIONS.CREATE_USER_DATABASE_ERROR.description,
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

    if (foundUser) {
      return [foundUser, null];
    }

    return [foundUser, null];
  } catch (error) {
    return [null, error];
  }
}

export const userRepository = { create, findOne } as const;
