export const AUTH_COOKIE_NAME = "accessToken";

export const JWT_EXPIRES_IN = "7d";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const getAuthCookieOptions = () => {
  const isProduction =
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,

    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",

    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
};

export const getClearAuthCookieOptions = () => {
  const { maxAge, ...options } =
    getAuthCookieOptions();

  return options;
};