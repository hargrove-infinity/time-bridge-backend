import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export type UserDocument = ReturnType<(typeof UserModel)["hydrate"]>;

export const UserModel = mongoose.model("User", userSchema);
