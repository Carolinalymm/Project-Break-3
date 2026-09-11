import { v2 as cloudinary } from "cloudinary";

import AppError from "../utils/appError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const ensureCloudinaryConfigured = () => {
  const requiredVariables = [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
  ];

  const configurationIsComplete =
    requiredVariables.every(Boolean);

  if (!configurationIsComplete) {
    throw new AppError(
      "Cloudinary no está configurado correctamente",
      500,
    );
  }
};

export default cloudinary;