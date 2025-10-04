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

export const UserModel = mongoose.model("User", userSchema);
