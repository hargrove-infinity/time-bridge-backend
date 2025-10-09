import jwt from "jsonwebtoken";
import { jwtService } from "../services";

describe("jwtService.sign", () => {
  test("should return valid tuple [JWT token, null] when provided with valid arguments", () => {
    const payload = { email: "mail@mail.com" };

    const [data, error] = jwtService.sign({
      payload,
      options: {
        algorithm: "HS256",
        expiresIn: "3h",
      },
    });

    expect(data).toBeDefined();
    expect(data).not.toBeNull();
    expect(typeof data).toBe("string");
    expect(error).toBe(null);

    const decoded = jwt.decode(data!);
    expect(decoded).toMatchObject(payload);
  });

  test("should use HS256 algorithm for signing", () => {
    const payload = { email: "mail@mail.com" };

    const [data, error] = jwtService.sign({
      payload,
      options: {
        algorithm: "HS256",
        expiresIn: "3h",
      },
    });

    expect(data).toBeDefined();
    expect(data).not.toBeNull();
    expect(typeof data).toBe("string");
    expect(error).toBe(null);

    const decoded = jwt.decode(data!, { complete: true });
    expect(decoded?.header.alg).toBe("HS256");
  });

  test("should use correct expiresIn for signing", () => {
    const payload = { email: "mail@mail.com" };

    const [data, error] = jwtService.sign({
      payload,
      options: {
        algorithm: "HS256",
        expiresIn: "3h",
      },
    });

    expect(data).toBeDefined();
    expect(data).not.toBeNull();
    expect(typeof data).toBe("string");
    expect(error).toBe(null);

    const decoded = jwt.decode(data!, { json: true });

    expect(typeof decoded?.iat).toBe("number");
    expect(typeof decoded?.exp).toBe("number");

    const expiresInHrs = (decoded?.exp! - decoded?.iat!) / 3600;
    expect(expiresInHrs).toBe(3);
  });
});
