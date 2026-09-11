import { Router } from "express";

import {
  getMe,
} from "../controllers/auth.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(requireAuth),
  getMe,
);

export default router;