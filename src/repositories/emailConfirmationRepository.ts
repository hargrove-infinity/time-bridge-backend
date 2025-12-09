import { ERROR_DEFINITIONS } from "../constants";
import { ApplicationError } from "../errors";
import {
  CreateEmailConfirmationArgs,
  EmailConfirmationDocument,
  EmailConfirmationModel,
  FindEmailConfirmationsArgs,
  FindOneEmailConfirmationArgs,
  FindOneAndUpdateEmailConfirmationArgs,
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

async function find(
  args: FindEmailConfirmationsArgs
): Promise<[EmailConfirmationDocument[], null] | [null, ApplicationError]> {
  const { filter, projection, options } = args;

  try {
    const foundEmailConfirmations = await EmailConfirmationModel.find(
      filter || {},
      projection,
      options
    );
    return [foundEmailConfirmations, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorDefinition:
          ERROR_DEFINITIONS.FIND_EMAIL_CONFIRMATIONS_DATABASE_ERROR,
        statusCode: 500,
      }),
    ];
  }
}

async function findOne(
  args: FindOneEmailConfirmationArgs
): Promise<
  [EmailConfirmationDocument | null, null] | [null, ApplicationError]
> {
  try {
    const foundEmailConfirmation = await EmailConfirmationModel.findOne(args);
    return [foundEmailConfirmation, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorDefinition:
          ERROR_DEFINITIONS.FIND_ONE_EMAIL_CONFIRMATION_DATABASE_ERROR,
        statusCode: 500,
      }),
    ];
  }
}

async function findOneAndUpdate(
  args: FindOneAndUpdateEmailConfirmationArgs
): Promise<
  [EmailConfirmationDocument | null, null] | [null, ApplicationError]
> {
  const { filter, update, options } = args;

  try {
    const updatedEmailConfirmation =
      await EmailConfirmationModel.findOneAndUpdate(filter, update, options);

    return [updatedEmailConfirmation, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorDefinition:
          ERROR_DEFINITIONS.FIND_ONE_AND_UPDATE_EMAIL_CONFIRMATION_DATABASE_ERROR,
        statusCode: 500,
      }),
    ];
  }
}

export const emailConfirmationRepository = {
  create,
  find,
  findOne,
  findOneAndUpdate,
} as const;
