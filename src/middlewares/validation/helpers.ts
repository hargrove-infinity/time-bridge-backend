import {
  ERROR_DEFINITIONS,
  ZOD_ISSUE_MESSAGE_EXPECTED_OBJECT_UNDEFINED,
} from "../../constants";
import { BuildValidationErrorsPayloadArgs, ErrorPayloadItem } from "./types";

export function buildValidationErrorsPayload({
  body,
  issues,
}: BuildValidationErrorsPayloadArgs): ErrorPayloadItem[] {
  return issues.map((issue) => {
    const key = issue.message;
    const errorEntries = Object.entries(ERROR_DEFINITIONS);
    const found = errorEntries.find((entry) => entry[0] === key);

    if (issue.message.includes(ZOD_ISSUE_MESSAGE_EXPECTED_OBJECT_UNDEFINED)) {
      return {
        code: ERROR_DEFINITIONS.REQUEST_BODY_MISSING.code,
        description: ERROR_DEFINITIONS.REQUEST_BODY_MISSING.description,
        data: [],
      };
    }

    if (!found) {
      return {
        code: ERROR_DEFINITIONS.UNKNOWN_ERROR_KEY.code,
        description: ERROR_DEFINITIONS.UNKNOWN_ERROR_KEY.description,
        data: [],
      };
    }

    const definition = found[1];
    const path = issue.path[0];

    return {
      code: definition.code || ERROR_DEFINITIONS.UNKNOWN_ERROR.code,
      description:
        definition.description || ERROR_DEFINITIONS.UNKNOWN_ERROR.description,
      data: path && typeof path === "string" && body[path] ? [body[path]] : [],
    };
  });
}
