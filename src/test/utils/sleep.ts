export async function sleep(delay: number): Promise<unknown> {
  return await new Promise((resolve) => setTimeout(resolve, delay));
}
