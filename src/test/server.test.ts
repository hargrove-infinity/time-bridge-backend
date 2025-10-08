import { SERVER_TEST_DELAY } from "../constants";
import { server } from "../server";

const spy = jest.spyOn(console, "info");

afterAll(() => {
  server.close();
  spy.mockRestore();
});

describe("server.ts", () => {
  test("server listens", () => {
    expect(server.listening).toBe(true);
  });

  test("server runs on env port", () => {
    const address = server.address();

    if (address === null) {
      throw new Error("missing address");
    }

    if (typeof address === "string") {
      throw new Error("address is a string");
    }

    const port = Number(process.env.PORT);

    expect(address.port).toBe(port);
  });

  test("server logs start message", async () => {
    await new Promise((resolve) => setTimeout(resolve, SERVER_TEST_DELAY));

    expect(spy).toHaveBeenCalledWith(
      `Server is running on port ${process.env.PORT}`
    );
  });
});
