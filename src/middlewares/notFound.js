import AppError from "../utils/appError.js";

const notFound = (req, res, next) => {
  const error = new AppError(
    `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    404,
  );

  next(error);
};

export default notFound;