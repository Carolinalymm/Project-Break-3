import AppError from "../utils/appError.js";

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Debes iniciar sesión para acceder a esta ruta",
          401,
        ),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "No tienes permisos para realizar esta acción",
          403,
        ),
      );
    }

    next();
  };
};

export default requireRole;