import { ERROR_MESSAGES } from "../constants";
import { UserInput, UserDocumentWithoutPassword, UserModel } from "../models";
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

export const userRepository = { create } as const;
