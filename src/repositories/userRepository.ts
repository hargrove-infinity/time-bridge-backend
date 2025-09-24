import bcrypt from "bcrypt";
import { UserDocument, UserModel } from "../models";
import { userValidationSchema } from "../validation";

async function create(
  args: unknown
): Promise<[UserDocument, null] | [null, unknown]> {
  try {
    const parsedArgs = userValidationSchema.parse(args);
    const { email, password } = parsedArgs;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
    });

    return [createdUser, null];
  } catch (error) {
    return [null, error];
  }
}

export const userRepository = { create } as const;
