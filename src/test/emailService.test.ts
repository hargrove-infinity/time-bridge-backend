import { emailService, transporter } from "../services";
import { MOCK_SUCCESS_SEND_EMAIL_RESPONSE } from "./constants";

jest.spyOn(emailService, "sendEmail").mockImplementation(async () => {
  return [MOCK_SUCCESS_SEND_EMAIL_RESPONSE, null];
});

describe("emailService", () => {
  describe("emailService.sendEmail", () => {
    test("should return email response object", async () => {
      const [result, error] = await emailService.sendEmail({
        transporter,
        toEmail: "mail@mail.com",
        subject: "Registration",
        html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
      });

      expect(result).toEqual(MOCK_SUCCESS_SEND_EMAIL_RESPONSE);
      expect(error).toBeNull();
    });
  });
});
