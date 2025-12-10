import { Types } from "mongoose";
import { MINUTES_IN_MILLISECONDS } from "../../../constants";
import { TEST_EMAIL_CONFIRMATION_CODE } from "../../constants";

export function createMockEmailConfirmations(userId: Types.ObjectId) {
  const emailConfirmData = {
    user: userId,
    isEmailSent: true,
    isEmailConfirmed: false,
    code: TEST_EMAIL_CONFIRMATION_CODE,
  };

  return [
    {
      ...emailConfirmData,
      expireCodeTime: new Date(Date.now() + MINUTES_IN_MILLISECONDS[26]),
      createdAt: new Date(Date.now() - MINUTES_IN_MILLISECONDS[4]),
      updatedAt: new Date(Date.now() - MINUTES_IN_MILLISECONDS[4]),
    },
    {
      ...emailConfirmData,
      expireCodeTime: new Date(Date.now() + MINUTES_IN_MILLISECONDS[27]),
      createdAt: new Date(Date.now() - MINUTES_IN_MILLISECONDS[3]),
      updatedAt: new Date(Date.now() - MINUTES_IN_MILLISECONDS[3]),
    },
    {
      ...emailConfirmData,
      expireCodeTime: new Date(Date.now() + MINUTES_IN_MILLISECONDS[28]),
      createdAt: new Date(Date.now() - MINUTES_IN_MILLISECONDS[2]),
      updatedAt: new Date(Date.now() - MINUTES_IN_MILLISECONDS[2]),
    },
    {
      ...emailConfirmData,
      expireCodeTime: new Date(Date.now() + MINUTES_IN_MILLISECONDS[29]),
      createdAt: new Date(Date.now() - MINUTES_IN_MILLISECONDS[1]),
      updatedAt: new Date(Date.now() - MINUTES_IN_MILLISECONDS[1]),
    },
    {
      ...emailConfirmData,
      expireCodeTime: new Date(Date.now() + MINUTES_IN_MILLISECONDS[30]),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
  ];
}
