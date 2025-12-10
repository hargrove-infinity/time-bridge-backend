import { envVariables } from "../../common";
import { ERROR_DEFINITIONS } from "../../constants";
import { ApplicationError } from "../../errors";
import { SendEmailArgs, SendEmailResult } from "./types";

async function sendEmail(args: SendEmailArgs): SendEmailResult {
  const { transporter, toEmail, subject, html } = args;

  try {
    const result = await transporter.emails.send({
      from: envVariables.sendEmailFrom,
      to: toEmail,
      subject,
      html,
    });

    if (result.error) {
      return [
        null,
        new ApplicationError({
          errorDefinition: ERROR_DEFINITIONS.SEND_EMAIL_FAILED,
          statusCode: 500,
        }),
      ];
    }

    return [result, null];
  } catch (error) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.SEND_EMAIL_FAILED,
        statusCode: 500,
      }),
    ];
  }
}

export const emailService = { sendEmail } as const;
