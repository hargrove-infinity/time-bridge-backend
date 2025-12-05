export function expectServerAddressInfo(data: unknown): asserts data is {
  address: string;
  family: string;
  port: number;
} {
  expect(data).toEqual({
    address: expect.any(String),
    family: expect.any(String),
    port: expect.any(Number),
  });
}
