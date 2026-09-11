import { Router } from "express";

import {
  getHealth,
  getDatabaseHealth,
  getMongoHealth,
} from "../controllers/health.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/", getHealth);

router.get(
  "/database",
  asyncHandler(getDatabaseHealth),
);

router.get(
  "/mongodb",
  asyncHandler(getMongoHealth),
);

export default router;