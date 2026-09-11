import AppError from "../utils/appError.js";
import {
  verifyAuthToken,
} from "../utils/token.js";
import {
  findUserById,
} from "../services/auth.service.js";
import {
  AUTH_COOKIE_NAME,
} from "../config/auth.js";

const getRequestToken = (req) => {
  const cookieToken =
    req.cookies?.[AUTH_COOKIE_NAME];

  if (cookieToken) {
    return cookieToken;
  }

  const authorizationHeader =
    req.headers.authorization;

  if (
    authorizationHeader?.startsWith("Bearer ")
  ) {
    return authorizationHeader.slice(7);
  }

  return null;
};

const requireAuth = async (req, res, next) => {
  const token = getRequestToken(req);

  if (!token) {
    throw new AppError(
      "Debes iniciar sesión para acceder a esta ruta",
      401,
    );
  }

  const decodedToken = verifyAuthToken(token);

  if (!decodedToken.sub) {
    throw new AppError(
      "El token no contiene un usuario válido",
      401,
    );
  }

  const user = await findUserById(
    decodedToken.sub,
  );

  if (!user) {
    throw new AppError(
      "El usuario de esta sesión ya no existe",
      401,
    );
  }

  req.user = user;

  next();
};

export default requireAuth;