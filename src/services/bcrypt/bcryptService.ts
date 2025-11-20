import bcrypt from "bcrypt";
import { DEFAULT_HASHING_ROUNDS, ERROR_DEFINITIONS } from "../../constants";
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
          errorDefinition: ERROR_DEFINITIONS.ROUNDS_NEGATIVE,
          statusCode: 500,
        }),
      ];
    }

    if (typeof saltOrRounds === "number" && saltOrRounds < 1) {
      return [
        null,
        new ApplicationError({
          errorDefinition: ERROR_DEFINITIONS.ROUNDS_LESS_THAN_ONE,
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
          errorDefinition: ERROR_DEFINITIONS.INVALID_SALT_HASHING_STRING,
          statusCode: 500,
        }),
      ];
    }

    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.ERROR_HASHING_STRING,
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
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.ERROR_COMPARING_HASH_STRING,
        statusCode: 500,
      }),
    ];
  }
}

export const bcryptService = { hash, compare } as const;
