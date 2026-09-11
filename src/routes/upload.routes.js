import { Router } from "express";

import {
  uploadProductImage,
  deleteProductImage,
} from "../controllers/upload.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/requireRole.js";
import {
  uploadSingleProductImage,
} from "../middlewares/upload.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.use(
  asyncHandler(requireAuth),
);

router.use(
  requireRole("ADMIN"),
);

router.post(
  "/",
  uploadSingleProductImage,
  asyncHandler(uploadProductImage),
);

router.delete(
  "/",
  asyncHandler(deleteProductImage),
);

export default router;