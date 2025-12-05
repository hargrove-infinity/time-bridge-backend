import request from "supertest";
import { app } from "../../../app";
import { EMAIL_CONFIRMATION_STEP, paths } from "../../../constants";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../constants";

export async function expectUserRequestRegisterSuccess() {
  const response = await request(app).post(paths.auth.register).send({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  expect(response.body).toStrictEqual({
    payload: { nextStep: EMAIL_CONFIRMATION_STEP },
  });
}
