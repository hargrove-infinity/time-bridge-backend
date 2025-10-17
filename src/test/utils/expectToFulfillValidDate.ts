export function expectToFulfillValidDate(date: NativeDate) {
  const convertedDate = new Date(date);
  const isValidDate = !isNaN(convertedDate.getTime());
  expect(isValidDate).toBe(true);
}
