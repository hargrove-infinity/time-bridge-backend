import { ERROR_DEFINITIONS } from "../../constants";
import { BuildValidationErrorsPayloadArgs, ErrorPayloadItem } from "./types";

export function buildValidationErrorsPayload({
  body,
  issues,
}: BuildValidationErrorsPayloadArgs): ErrorPayloadItem[] {
  return issues.map((issue) => {
    const key = issue.message as keyof typeof ERROR_DEFINITIONS;
    const path = issue.path[0];

    return {
      code:
        ERROR_DEFINITIONS[key]?.code || ERROR_DEFINITIONS.UNKNOWN_ERROR.code,
      description:
        ERROR_DEFINITIONS[key]?.description ||
        ERROR_DEFINITIONS.UNKNOWN_ERROR.description,
      data: path && typeof path === "string" && body[path] ? [body[path]] : [],
    };
  });
}
