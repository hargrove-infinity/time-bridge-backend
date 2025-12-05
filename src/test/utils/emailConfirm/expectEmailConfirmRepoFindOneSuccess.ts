import {
  EmailConfirmationDocument,
  FindOneEmailConfirmationArgs,
} from "../../../models";
import { emailConfirmationRepository } from "../../../repositories";

function expectEmailConfirmDocument(data: unknown): asserts data is {
  _id: object;
  user: object;
  isEmailSent: boolean;
  isEmailConfirmed: boolean;
  code: string;
  expireCodeTime: object;
  createdAt: object;
  updatedAt: object;
  __v: number;
} {
  expect(data).toMatchObject({
    _id: expect.any(Object),
    user: expect.any(Object),
    isEmailSent: expect.any(Boolean),
    isEmailConfirmed: expect.any(Boolean),
    code: expect.any(String),
    expireCodeTime: expect.any(Object),
    createdAt: expect.any(Object),
    updatedAt: expect.any(Object),
    __v: expect.any(Number),
  });
}

export async function expectEmailConfirmRepoFindOneSuccess(
  args: FindOneEmailConfirmationArgs
): Promise<EmailConfirmationDocument> {
  const [foundEmailConfirmation, errorFindOneEmailConfirmation] =
    await emailConfirmationRepository.findOne(args);

  expect(errorFindOneEmailConfirmation).toBeNull();

  expectEmailConfirmDocument(foundEmailConfirmation);

  return foundEmailConfirmation;
}
