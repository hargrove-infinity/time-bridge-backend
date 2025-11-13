import { ERROR_DEFINITIONS } from "../../constants";
import { BuildValidationErrorsPayloadArgs, ErrorPayloadItem } from "./types";

export function buildValidationErrorsPayload({
  body,
  issues,
}: BuildValidationErrorsPayloadArgs): ErrorPayloadItem[] {
  return issues.map((issue) => {
    const key = issue.message;
    const errorEntries = Object.entries(ERROR_DEFINITIONS)
    const found = errorEntries.find(entry => entry[0] === key);
    if (!found) {
      throw new Error(`Unknown error key: ${key}`);
    }
    const definition = found[1];
    const path = issue.path[0];

    return {
      code:
        definition.code || ERROR_DEFINITIONS.UNKNOWN_ERROR.code,
      description:
        definition.description ||
        ERROR_DEFINITIONS.UNKNOWN_ERROR.description,
      data: path && typeof path === "string" && body[path] ? [body[path]] : [],
    };
  });
}
