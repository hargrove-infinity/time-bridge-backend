import { UserDocumentWithoutPassword } from "../../../models";
import { userRepository } from "../../../repositories";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../constants";

function expectCreatedUserWithoutPassword(data: unknown): asserts data is {
  _id: object;
  email: string;
  createdAt: object;
  updatedAt: object;
  __v: number;
} {
  expect(data).toStrictEqual({
    _id: expect.any(Object),
    email: TEST_USER_EMAIL,
    createdAt: expect.any(Object),
    updatedAt: expect.any(Object),
    __v: expect.any(Number),
  });
}

export async function expectUserRepoCreateSuccess(): Promise<UserDocumentWithoutPassword> {
  const [createdUser, errorCreateUser] = await userRepository.create({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expectCreatedUserWithoutPassword(createdUser);

  expect(errorCreateUser).toBeNull();

  return createdUser;
}
