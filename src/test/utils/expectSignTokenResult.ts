import { SignTokenResult } from "../../services";

export function expectSignTokenResult(
  data: SignTokenResult
): asserts data is [string, null] {
  const [token, errorSign] = data;

  expect(token).toBeDefined();
  expect(token).not.toBeNull();
  expect(typeof token).toBe("string");
  expect(errorSign).toBe(null);
}
