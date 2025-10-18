import mongoose, { InferSchemaType } from "mongoose";
import { UserModel, userSchema } from "./userModel";

type UserSchema = InferSchemaType<typeof userSchema>;

export type CreateUserArgs = Pick<UserSchema, "email" | "password">;

export type UserDocumentWithoutPassword = Omit<UserSchema, "password"> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type FindOneUserArgs = Parameters<(typeof UserModel)["findOne"]>[0];
