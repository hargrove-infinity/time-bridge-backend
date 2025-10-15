export function validateDate(date: NativeDate): boolean {
  const convertedDate = new Date(date);
  return !isNaN(convertedDate.getTime());
}
