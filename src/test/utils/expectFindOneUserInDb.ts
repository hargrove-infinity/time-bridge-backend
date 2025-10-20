import { UserDocument } from "../../models";
import { userRepository } from "../../repositories";
import { TEST_USER_EMAIL } from "../constants";
import { expectCreatedUserWithPassword } from "./expectCreatedUserWithPassword";

export async function expectFindOneUserInDb(): Promise<UserDocument> {
  const [foundUser, errorFindOneUser] = await userRepository.findOne({
    email: TEST_USER_EMAIL,
  });

  // expect(foundUser).toEqual(expect.anything());

  expectCreatedUserWithPassword(foundUser?.toObject());

  expect(errorFindOneUser).toBeNull();

  return foundUser;
}
