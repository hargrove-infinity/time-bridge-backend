import { ApplicationError } from "../../errors";

export function expectBcryptCompareResult({
  data,
  result,
}: {
  data: [boolean, null] | [null, ApplicationError];
  result: boolean;
}) {
  const [isMatched, errorCompare] = data;

  expect(errorCompare).toBeNull();
  expect(isMatched).toBeDefined();
  expect(typeof isMatched).toEqual("boolean");
  expect(isMatched).toBe(result);
}
