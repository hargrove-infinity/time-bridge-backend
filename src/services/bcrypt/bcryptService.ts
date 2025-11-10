import bcrypt from "bcrypt";
import { DEFAULT_HASHING_ROUNDS, ERROR_MESSAGES } from "../../constants";
import {
  BcryptHashArgs,
  BcryptHashResult,
  CompareHashArgs,
  CompareHashResult,
} from "./types";

async function hash({ data, saltOrRounds }: BcryptHashArgs): BcryptHashResult {
  try {
    if (typeof saltOrRounds === "number" && saltOrRounds < 0) {
      return [null, { errors: [ERROR_MESSAGES.ROUNDS_NEGATIVE] }];
    }

    if (typeof saltOrRounds === "number" && saltOrRounds < 1) {
      return [null, { errors: [ERROR_MESSAGES.ROUNDS_LESS_THAN_ONE] }];
    }

    const hash = await bcrypt.hash(
      data,
      saltOrRounds || DEFAULT_HASHING_ROUNDS
    );

    return [hash, null];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("Invalid salt")) {
      return [null, { errors: [ERROR_MESSAGES.INVALID_SALT_HASHING_STRING] }];
    }

    return [null, { errors: [ERROR_MESSAGES.ERROR_HASHING_STRING] }];
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
