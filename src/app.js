import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import swaggerSpecification from "./config/swagger.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import meRoutes from "./routes/me.routes.js";
import productRoutes from "./routes/product.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import {
  sendSuccess,
} from "./utils/apiResponse.js";

const app = express();

app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

app.get(
  [
    "/favicon.ico",
    "/favicon.svg",
  ],
  (req, res) => {
    return res.status(204).end();
  },
);

app.get("/", (req, res) => {
  return sendSuccess(res, {
    message:
      "Bienvenida a Backend React Ready",
    data: {
      documentation:
        "/api/docs",
      openApiJson:
        "/api/docs.json",
      health:
        "/api/health",
      databaseHealth:
        "/api/health/database",
      mongoHealth:
        "/api/health/mongodb",
      register:
        "/api/auth/register",
      login:
        "/api/auth/login",
      logout:
        "/api/auth/logout",
      currentUser:
        "/api/me",
      products:
        "/api/products",
      productReviews:
        "/api/products/:id/reviews",
      reviews:
        "/api/reviews/:reviewId",
      wishlist:
        "/api/wishlist",
      cart:
        "/api/cart",
      cartItems:
        "/api/cart/items",
      checkout:
        "/api/cart/checkout",
      orders:
        "/api/orders",
      orderDetail:
        "/api/orders/:orderId",
      productImageUpload:
        "/api/uploads/products",
    },
  });
});

app.get(
  "/api/docs.json",
  (req, res) => {
    return res.status(200).json(
      swaggerSpecification,
    );
  },
);
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerSpecification,
    {
      customSiteTitle:
        "Backend React Ready API",

      swaggerOptions: {
        withCredentials: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        docExpansion: "none",
      },
    },
  ),
);
app.use(
  "/api/health",
  healthRoutes,
);

app.use(
  "/api/auth",
  authRoutes,
);

app.use(
  "/api/me",
  meRoutes,
);

app.use(
  "/api/products",
  productRoutes,
);

app.use(
  "/api/reviews",
  reviewRoutes,
);

app.use(
  "/api/wishlist",
  wishlistRoutes,
);

app.use(
  "/api/cart",
  cartRoutes,
);

app.use(
  "/api/orders",
  orderRoutes,
);

app.use(
  "/api/uploads/products",
  uploadRoutes,
);
app.use(notFound);
app.use(errorHandler);

export default app;