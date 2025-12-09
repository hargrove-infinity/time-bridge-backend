import {
  InferSchemaType,
  FilterQuery,
  ProjectionType,
  QueryOptions,
} from "mongoose";
import {
  EmailConfirmationModel,
  emailConfirmationSchema,
} from "./emailConfirmationModel";

type EmailConfirmationSchema = InferSchemaType<typeof emailConfirmationSchema>;

export type EmailConfirmationDocument = ReturnType<
  (typeof EmailConfirmationModel)["hydrate"]
>;

export type CreateEmailConfirmationArgs = Omit<
  EmailConfirmationSchema,
  "createdAt" | "updatedAt"
>;

export interface FindEmailConfirmationsArgs {
  filter?: FilterQuery<EmailConfirmationDocument>;
  projection?: ProjectionType<EmailConfirmationDocument> | null;
  options?: QueryOptions<EmailConfirmationDocument> | null;
}

export type FindOneEmailConfirmationArgs = Parameters<
  (typeof EmailConfirmationModel)["findOne"]
>[0];

type FindOneAndUpdateEmailConfirmationParameters = Parameters<
  (typeof EmailConfirmationModel)["findOneAndUpdate"]
>;

export interface FindOneAndUpdateEmailConfirmationArgs {
  filter?: FindOneAndUpdateEmailConfirmationParameters[0];
  update?: FindOneAndUpdateEmailConfirmationParameters[1];
  options?: FindOneAndUpdateEmailConfirmationParameters[2];
}
