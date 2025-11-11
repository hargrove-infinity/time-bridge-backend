import { ErrorData } from "../../errors";

export interface BcryptHashArgs {
  data: string | Buffer;
  saltOrRounds?: string | number;
}

export type BcryptHashResult = Promise<[string, null] | [null, ErrorData]>;

export interface CompareHashArgs {
  data: string | Buffer;
  encrypted: string;
}

export type CompareHashResult = Promise<[boolean, null] | [null, ErrorData]>;
