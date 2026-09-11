import "dotenv/config";
import jwt from "jsonwebtoken";

import AppError from "./appError.js";
import { JWT_EXPIRES_IN } from "../config/auth.js";

if (!process.env.JWT_SECRET) {
  throw new Error(
    "Falta la variable JWT_SECRET en el archivo .env",
  );
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET debe tener al menos 32 caracteres",
  );
}

export const createAuthToken = (user) => {
  return jwt.sign(
    {
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn: JWT_EXPIRES_IN,
      issuer: "backend-react-ready",
      audience: "react-client",
    },
  );
};

export const verifyAuthToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        issuer: "backend-react-ready",
        audience: "react-client",
      },
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(
        "La sesión ha caducado. Inicia sesión de nuevo",
        401,
      );
    }

    throw new AppError(
      "Token de autenticación no válido",
      401,
    );
  }
};