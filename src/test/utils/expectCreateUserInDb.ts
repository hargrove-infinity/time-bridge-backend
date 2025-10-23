import { UserDocumentWithoutPassword } from "../../models";
import { userRepository } from "../../repositories";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";
import { expectCreatedUserWithoutPassword } from "./expectCreatedUserWithoutPassword";

export async function expectCreateUserInDb(): Promise<UserDocumentWithoutPassword> {
  const [createdUser, errorCreateUser] = await userRepository.create({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expectCreatedUserWithoutPassword(createdUser);

  expect(errorCreateUser).toBeNull();

  return createdUser;
}
