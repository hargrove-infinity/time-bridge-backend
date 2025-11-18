import bcrypt from "bcrypt";
import {
  DEFAULT_HASHING_ROUNDS,
  ERROR_DEFINITIONS,
  ERROR_MESSAGES,
} from "../../constants";
import { ApplicationError } from "../../errors";
import {
  BcryptHashArgs,
  BcryptHashResult,
  CompareHashArgs,
  CompareHashResult,
} from "./types";

async function hash({ data, saltOrRounds }: BcryptHashArgs): BcryptHashResult {
  try {
    if (typeof saltOrRounds === "number" && saltOrRounds < 0) {
      return [
        null,
        new ApplicationError({
          errorCode: ERROR_DEFINITIONS.ROUNDS_NEGATIVE.code,
          errorDescription: ERROR_DEFINITIONS.ROUNDS_NEGATIVE.description,
          statusCode: 500,
        }),
      ];
    }

    if (typeof saltOrRounds === "number" && saltOrRounds < 1) {
      return [
        null,
        new ApplicationError({
          errorCode: ERROR_DEFINITIONS.ROUNDS_LESS_THAN_ONE.code,
          errorDescription: ERROR_DEFINITIONS.ROUNDS_LESS_THAN_ONE.description,
          statusCode: 500,
        }),
      ];
    }

    const hash = await bcrypt.hash(
      data,
      saltOrRounds || DEFAULT_HASHING_ROUNDS
    );

    return [hash, null];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("Invalid salt")) {
      return [
        null,
        new ApplicationError({
          errorCode: ERROR_DEFINITIONS.INVALID_SALT_HASHING_STRING.code,
          errorDescription:
            ERROR_DEFINITIONS.INVALID_SALT_HASHING_STRING.description,
          statusCode: 500,
        }),
      ];
    }

    return [
      null,
      new ApplicationError({
        errorCode: ERROR_DEFINITIONS.ERROR_HASHING_STRING.code,
        errorDescription: ERROR_DEFINITIONS.ERROR_HASHING_STRING.description,
        statusCode: 500,
      }),
    ];
  }
}

async function compare({
  data,
  encrypted,
}: CompareHashArgs): CompareHashResult {
  try {
    const isMatched = await bcrypt.compare(data, encrypted);
    return [isMatched, null];
  } catch (error) {
    return [null, { errors: [ERROR_MESSAGES.ERROR_COMPARING_HASH_STRING] }];
  }
}

export const bcryptService = { hash, compare } as const;
