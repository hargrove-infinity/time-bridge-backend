import { CreateEmailResponseSuccess, Resend } from "resend";
import { ApplicationError } from "../../errors";

export interface SendEmailArgs {
  transporter: Resend;
  toEmail: string;
  subject: string;
  html: string;
}

type SendEmailSuccessResult = {
  data: CreateEmailResponseSuccess;
  error: null;
} & {
  headers: Record<string, string> | null;
};

export type SendEmailResult = Promise<
  [SendEmailSuccessResult, null] | [null, ApplicationError]
>;
