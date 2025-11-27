import mongoose, { InferSchemaType } from "mongoose";
import { UserModel, userSchema } from "./userModel";
import {
  EmailConfirmationModel,
  emailConfirmationSchema,
} from "./emailConfirmationModel";

// User
type UserSchema = InferSchemaType<typeof userSchema>;

export type CreateUserArgs = Pick<UserSchema, "email" | "password">;

export type UserDocument = ReturnType<(typeof UserModel)["hydrate"]>;

export type UserDocumentWithoutPassword = Omit<UserSchema, "password"> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type FindOneUserArgs = Parameters<(typeof UserModel)["findOne"]>[0];

// Email confirmation
type EmailConfirmationSchema = InferSchemaType<typeof emailConfirmationSchema>;

export type CreateEmailConfirmationArgs = Omit<
  EmailConfirmationSchema,
  "createdAt" | "updatedAt"
>;

export type EmailConfirmationDocument = ReturnType<
  (typeof EmailConfirmationModel)["hydrate"]
>;
