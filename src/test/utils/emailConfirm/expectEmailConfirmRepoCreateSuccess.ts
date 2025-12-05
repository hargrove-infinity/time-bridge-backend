import { CreateEmailConfirmationArgs } from "../../../models";
import { emailConfirmationRepository } from "../../../repositories";

export async function expectEmailConfirmRepoCreateSuccess(
  args: CreateEmailConfirmationArgs
): Promise<void> {
  const [createdEmailConfirmation, errorCreateEmailConfirmation] =
    await emailConfirmationRepository.create(args);

  expect(errorCreateEmailConfirmation).toBeNull();

  expect(createdEmailConfirmation?.toObject()).toMatchObject(args);
}
