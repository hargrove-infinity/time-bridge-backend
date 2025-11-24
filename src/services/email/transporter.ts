import { Resend } from "resend";
import { envVariables } from "../../common";

export const transporter = new Resend(envVariables.sendEmailApiKey);
