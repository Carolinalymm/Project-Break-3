import mongoose from "mongoose";

export const connectMongo = async () => {

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error(
      "Falta la variable MONGO_URI en el archivo .env",
    );
  }

  await mongoose.connect(
    process.env.MONGO_URI,
    {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    },
  );

  console.log(
    "Conexión con MongoDB Atlas establecida correctamente",
  );
};

export const disconnectMongo = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();

    console.log(
      "Conexión con MongoDB Atlas cerrada",
    );
  }
};

export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

export default mongoose;