import { TEST_USER_EMAIL } from "../constants";

export function expectCreatedUserWithPassword(data: unknown): asserts data is {
  email: string;
  password: string;
  _id: object;
  createdAt: object;
  updatedAt: object;
} {
  expect(data).toMatchObject({
    email: TEST_USER_EMAIL,
    password: expect.any(String),
    _id: expect.any(Object),
    createdAt: expect.any(Object),
    updatedAt: expect.any(Object),
  });
}
