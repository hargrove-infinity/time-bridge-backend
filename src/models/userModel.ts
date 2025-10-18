import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

type User = InferSchemaType<typeof userSchema>;

export type UserInput = Pick<User, "email" | "password">;

export type UserDocument = ReturnType<(typeof UserModel)["hydrate"]>;

export type UserDocumentWithoutPassword = Omit<User, "password"> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const UserModel = mongoose.model("User", userSchema);

export type FindOneUserArgs = Parameters<(typeof UserModel)["findOne"]>[0];
