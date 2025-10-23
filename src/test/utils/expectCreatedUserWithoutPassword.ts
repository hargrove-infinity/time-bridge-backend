import { TEST_USER_EMAIL } from "../constants";

export function expectCreatedUserWithoutPassword(
  data: unknown
): asserts data is {
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
