import multer from "multer";

import AppError from "../utils/appError.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const productImageUpload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new AppError(
          "Solo se permiten imágenes JPEG, PNG o WebP",
          400,
        ),
      );
    }

    return callback(null, true);
  },
});

export const uploadSingleProductImage = (
  req,
  res,
  next,
) => {
  productImageUpload.single("image")(
    req,
    res,
    (error) => {
      if (!error) {
        return next();
      }
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError(
              "La imagen no puede superar los 5 MB",
              400,
            ),
          );
        }

        if (error.code === "LIMIT_FILE_COUNT") {
          return next(
            new AppError(
              "Solo puedes subir una imagen",
              400,
            ),
          );
        }

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return next(
            new AppError(
              'El campo del archivo debe llamarse "image"',
              400,
            ),
          );
        }

        return next(
          new AppError(
            "No se pudo procesar la imagen",
            400,
          ),
        );
      }

      return next(error);
    },
  );
};