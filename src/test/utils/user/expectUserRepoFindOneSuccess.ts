import { UserDocument } from "../../../models";
import { userRepository } from "../../../repositories";
import { TEST_USER_EMAIL } from "../../constants";

function expectCreatedUserWithPassword(data: unknown): asserts data is {
  _id: object;
  email: string;
  password: string;
  createdAt: object;
  updatedAt: object;
  __v: number;
} {
  expect(data).toStrictEqual({
    _id: expect.any(Object),
    email: TEST_USER_EMAIL,
    password: expect.any(String),
    createdAt: expect.any(Object),
    updatedAt: expect.any(Object),
    __v: expect.any(Number),
  });
}

export async function expectUserRepoFindOneSuccess(): Promise<UserDocument> {
  const [foundUser, errorFindOneUser] = await userRepository.findOne({
    email: TEST_USER_EMAIL,
  });

  expectCreatedUserWithPassword(foundUser?.toObject());

  expect(errorFindOneUser).toBeNull();

  return foundUser;
}
