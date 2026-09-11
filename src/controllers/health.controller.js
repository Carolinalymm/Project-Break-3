import supabase from "../config/database.js";
import mongoose, {
  isMongoConnected,
} from "../config/mongo.js";
import { sendSuccess } from "../utils/apiResponse.js";
import AppError from "../utils/appError.js";

export const getHealth = (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: "API funcionando correctamente",
    data: {
      environment:
        process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  });
};

export const getDatabaseHealth = async (
  req,
  res,
) => {
  const { count, error } = await supabase
    .from("products")
    .select("id", {
      count: "exact",
      head: true,
    });

  if (error) {
    throw new AppError(
      `No se pudo conectar con Supabase: ${error.message}`,
      503,
    );
  }

  return sendSuccess(res, {
    statusCode: 200,
    message: "Conexión con Supabase correcta",
    data: {
      database: "connected",
      productsCount: count ?? 0,
      timestamp: new Date().toISOString(),
    },
  });
};

export const getMongoHealth = async (
  req,
  res,
) => {
  if (!isMongoConnected()) {
    throw new AppError(
      "MongoDB no está conectado",
      503,
    );
  }

  try {

    await mongoose.connection.db
      .admin()
      .ping();
  } catch {
    throw new AppError(
      "No se pudo conectar con MongoDB",
      503,
    );
  }

  return sendSuccess(res, {
    statusCode: 200,
    message: "Conexión con MongoDB correcta",
    data: {
      database: "connected",
      provider: "MongoDB Atlas",
      timestamp: new Date().toISOString(),
    },
  });
};