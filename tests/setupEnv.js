process.env.NODE_ENV = "test";

process.env.PORT = "3001";

process.env.FRONTEND_URL =
  "http://localhost:5173";

process.env.SUPABASE_URL =
  "https://test-project.supabase.co";

process.env.SUPABASE_SECRET_KEY =
  "test-service-role-key";
process.env.JWT_SECRET =
  "test-jwt-secret-with-more-than-32-characters";

process.env.JWT_EXPIRES_IN = "1h";

process.env.MONGO_CONNECT = "false";

process.env.MONGO_URI =
  "mongodb://127.0.0.1:27017/backend_test";

process.env.CLOUDINARY_CLOUD_NAME =
  "test-cloud";

process.env.CLOUDINARY_API_KEY =
  "test-api-key";

process.env.CLOUDINARY_API_SECRET =
  "test-api-secret";