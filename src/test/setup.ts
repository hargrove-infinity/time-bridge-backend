import { UserModel } from "../models";
import { connectDatabase, closeConnectionDatabase } from "../utils";

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await closeConnectionDatabase();
});
