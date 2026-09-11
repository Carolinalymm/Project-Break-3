import { Router } from "express";

import {
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.put(
  "/:reviewId",
  asyncHandler(requireAuth),
  asyncHandler(updateReview),
);

router.delete(
  "/:reviewId",
  asyncHandler(requireAuth),
  asyncHandler(deleteReview),
);

export default router;