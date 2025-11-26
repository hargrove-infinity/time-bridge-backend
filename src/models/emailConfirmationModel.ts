import mongoose from "mongoose";

export const emailConfirmationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isEmailSent: { type: Boolean, required: true },
    isEmailConfirmed: { type: Boolean, required: true },
    code: { type: String, required: true },
    expireCodeTime: { type: Date, required: true },
  },
  { timestamps: true }
);

export const EmailConfirmationModel = mongoose.model(
  "EmailConfirmation",
  emailConfirmationSchema
);
