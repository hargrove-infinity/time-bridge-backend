import { ERROR_DEFINITIONS } from "../constants";
import { ApplicationError } from "../errors";
import {
  CreateEmailConfirmationArgs,
  EmailConfirmationDocument,
  EmailConfirmationModel,
} from "../models";

async function create(
  args: CreateEmailConfirmationArgs
): Promise<[EmailConfirmationDocument, null] | [null, ApplicationError]> {
  try {
    const createdEmailConfirmation = await EmailConfirmationModel.create(args);
    return [createdEmailConfirmation, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorDefinition:
          ERROR_DEFINITIONS.CREATE_EMAIL_CONFIRMATION_DATABASE_ERROR,
        statusCode: 500,
      }),
    ];
  }
}

export const emailConfirmationRepository = { create } as const;
