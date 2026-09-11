import "dotenv/config";

import app from "./app.js";
import {
  connectMongo,
  disconnectMongo,
} from "./config/mongo.js";

const PORT = Number(process.env.PORT) || 3000;

const shouldConnectMongo =
  process.env.MONGO_CONNECT === "true";

let server;
let isShuttingDown = false;

const startServer = async () => {
  try {

    if (shouldConnectMongo) {
      await connectMongo();
    } else {
      console.log(
        "Conexión con MongoDB omitida en este entorno",
      );
    }

    server = app.listen(PORT, () => {
      console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error(
      "No se pudo iniciar la aplicación:",
      error,
    );

    process.exit(1);
  }
};

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(
    `Señal ${signal} recibida. Cerrando aplicación...`,
  );

  if (server) {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }

  await disconnectMongo();

  console.log("Aplicación cerrada correctamente");

  process.exit(0);
};

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

startServer();