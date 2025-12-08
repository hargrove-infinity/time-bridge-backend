import {
  DEFAULT_ALGORITHM_TOKEN,
  DEFAULT_EXPIRES_IN_TOKEN_STRING,
  EMAIL_CONFIRMATION_STEP,
  ERROR_DEFINITIONS,
  MINUTES_IN_MILLISECONDS,
} from "../constants";
import { emailConfirmationRepository, userRepository } from "../repositories";
import { ApplicationError } from "../errors";
import { UserInput } from "../validation";
import { generateRandomStringCode } from "../utils";
import { jwtService } from "./jwt";
import { bcryptService } from "./bcrypt";
import { emailService, transporter } from "./email";

async function register(
  args: UserInput
): Promise<[{ nextStep: string }, null] | [null, ApplicationError]> {
  const [hash, errorHash] = await bcryptService.hash({ data: args.password });

  if (errorHash) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  const [user, errorCreateUser] = await userRepository.create({
    email: args.email,
    password: hash,
  });

  if (errorCreateUser) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  const confirmationCode = generateRandomStringCode();

  const [, errorSendEmail] = await emailService.sendEmail({
    transporter,
    toEmail: args.email,
    subject: "Registration",
    html: `Your code is ${confirmationCode}`,
  });

  if (errorSendEmail) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  const [, errorCreateEmailConfirmation] =
    await emailConfirmationRepository.create({
      user: user._id,
      isEmailSent: true,
      isEmailConfirmed: false,
      code: String(confirmationCode),
      expireCodeTime: new Date(Date.now() + MINUTES_IN_MILLISECONDS[30]),
    });

  if (errorCreateEmailConfirmation) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  return [{ nextStep: EMAIL_CONFIRMATION_STEP }, null];
}

async function emailConfirm(args: {
  email: string;
  code: string;
}): Promise<[string, null] | [null, ApplicationError]> {
  const [foundUser, errorFindUser] = await userRepository.findOne({
    email: args.email,
  });

  if (errorFindUser) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  if (!foundUser) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.EMAIL_CONFIRMATION_FAILED,
        statusCode: 400,
      }),
    ];
  }

  const [updatedEmailConfirmation, errorFindOneAndUpdateEmailConfirmation] =
    await emailConfirmationRepository.findOneAndUpdate({
      filter: {
        user: foundUser._id,
        code: args.code,
        expireCodeTime: { $gt: new Date() },
      },
      update: { isEmailConfirmed: true },
      options: { new: true },
    });

  if (errorFindOneAndUpdateEmailConfirmation) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  if (!updatedEmailConfirmation) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.EMAIL_CONFIRMATION_FAILED,
        statusCode: 400,
      }),
    ];
  }

  const [token, errorSignToken] = jwtService.sign({
    payload: { _id: foundUser._id, email: foundUser.email },
    options: {
      algorithm: DEFAULT_ALGORITHM_TOKEN,
      expiresIn: DEFAULT_EXPIRES_IN_TOKEN_STRING,
    },
  });

  if (errorSignToken) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  return [token, null];
}

// TODO: implement POST /resend-code endpoint

// 5 - times of resendings
// 10 seconds - delay between resendings

// POST /resend-code
// check length of emailConfirmation by user
// if length is 5 then block user
//
// otherwise
//
// check emailConfirmation within 10 seconds from now
// find the latest emailConfirmation (sort by createdAt in DESC)
// check if the latest emailConfirmation has createdAt at 10 seconds ago (now() - 10 seconds)
// if there is not emailConfirmation document with criteria above
//
// create new emailConfirmation document
// and send email
//

// TODO: implement POST /check endpoint
// emailConfirmation createdAt: 2025-12-08T18:45:00.000+00:00
// next possible resend time emailConfirmation createdAt + 10 seconds (2025-12-08T18:45:10.000+00:00)
// backend sends nextResendTime: 2025-12-08T18:45:10.000+00:00
// user reloads page on 2025-12-08T18:45:05.000+00:00
// /check returns nextResendTime: 2025-12-08T18:45:10.000+00:00
// on frontend: left time = now() - nextResendTime

async function login(
  args: UserInput
): Promise<[string, null] | [null, ApplicationError]> {
  const [foundUser, errorFindUser] = await userRepository.findOne({
    email: args.email,
  });

  if (errorFindUser) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  if (!foundUser) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.LOGIN_FAILED,
        statusCode: 400,
      }),
    ];
  }

  const [foundEmailConfirmation, errorFindOneEmailConfirmation] =
    await emailConfirmationRepository.findOne({
      user: foundUser._id,
      isEmailConfirmed: true,
    });

  if (errorFindOneEmailConfirmation) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  if (!foundEmailConfirmation) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.LOGIN_FAILED,
        statusCode: 400,
      }),
    ];
  }

  const [isMatched, errorCompare] = await bcryptService.compare({
    data: args.password,
    encrypted: foundUser.password,
  });

  if (errorCompare) {
    return [null, errorCompare];
  }

  if (!isMatched) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.LOGIN_FAILED,
        statusCode: 400,
      }),
    ];
  }

  const [token, errorSignToken] = jwtService.sign({
    payload: { _id: foundUser._id, email: foundUser.email },
    options: {
      algorithm: DEFAULT_ALGORITHM_TOKEN,
      expiresIn: DEFAULT_EXPIRES_IN_TOKEN_STRING,
    },
  });

  if (errorSignToken) {
    return [
      null,
      new ApplicationError({
        errorDefinition: ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      }),
    ];
  }

  return [token, null];
}

export const userService = { register, emailConfirm, login } as const;
