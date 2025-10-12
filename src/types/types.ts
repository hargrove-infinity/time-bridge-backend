export interface ErrorData {
  errors: string[];
}

export type SignTokenResult = [string, null] | [null, ErrorData];
