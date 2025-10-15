import mongoose from "mongoose";

export function expectToMatchUserDocument(
  data: unknown
): asserts data is mongoose.Document & {
  email: string;
  password: string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
} {
  expect(data).toBeDefined();
  expect(data).not.toBeNull();
  expect(data).toMatchObject({
    email: expect.any(String),
    password: expect.any(String),
    _id: expect.any(mongoose.Types.ObjectId),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });
}
