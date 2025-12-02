import httpMocks from "node-mocks-http";
import { EMAIL_CONFIRMATION_STEP } from "../../constants";
import { userRoutes } from "../../routes";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../constants";

export async function expectRegisterUserRouteReturnsCorrectPayload(): Promise<void> {
  const requestCreateUser = httpMocks.createRequest({
    body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
  });
  const responseCreateUser = httpMocks.createResponse();
  await userRoutes.register(requestCreateUser, responseCreateUser);

  expect(responseCreateUser.statusCode).toBe(200);

  const dataCreateUser = responseCreateUser._getData();

  expect(dataCreateUser.payload).toEqual({
    nextStep: EMAIL_CONFIRMATION_STEP,
  });
}
