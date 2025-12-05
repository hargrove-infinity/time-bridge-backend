export function expectBcryptServiceHashSuccess(
  data: unknown
): asserts data is [string, null] {
  expect(Array.isArray(data)).toBe(true);
  expect(data).toHaveLength(2);

  const [hash, error] = data as [unknown, unknown];

  expect(error).toBeNull();
  expect(hash).toBeDefined();
  expect(typeof hash).toEqual("string");
  expect(hash).not.toBe("password");
  expect(hash).toMatch(/^\$2[aby]\$/);
}
