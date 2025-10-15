import { TEST_USER_EMAIL } from "../constants";

export function expectToEqualCreatedUser(data: unknown): asserts data is {
  email: string;
  _id: object;
  createdAt: object;
  updatedAt: object;
} {
  expect(data).toMatchObject({
    email: TEST_USER_EMAIL,
    _id: expect.any(Object),
    createdAt: expect.any(Object),
    updatedAt: expect.any(Object),
  });
}
