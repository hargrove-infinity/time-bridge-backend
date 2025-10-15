import { TEST_USER_EMAIL } from "../constants";

export function expectToFulfillJwtPayload(data: unknown): asserts data is {
  _id: string;
  email: string;
  iat: number;
  exp: number;
} {
  expect(data).toStrictEqual({
    _id: expect.any(String),
    email: TEST_USER_EMAIL,
    iat: expect.any(Number),
    exp: expect.any(Number),
  });
}
