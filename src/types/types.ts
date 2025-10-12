export interface ErrorData {
  errors: string[];
}

export interface SignAuthTokenPayload {
  email: string;
}

export type SignTokenResult = [string, null] | [null, ErrorData];
