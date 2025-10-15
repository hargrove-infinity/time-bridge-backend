export function expectToFulfillTokenString(
  data: unknown
): asserts data is string {
  expect(data).toBeDefined();
  expect(data).not.toBeNull();
  expect(typeof data).toBe("string");
}
