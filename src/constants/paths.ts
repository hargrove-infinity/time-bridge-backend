export const paths = {
  common: { base: "/" },
  auth: {
    register: "/register",
    emailConfirm: "/email-confirm",
    resendCode: "/resend-code",
    login: "/login",
  },
} as const;
