import { Router } from "express";

import {
  getWishlist,
  addWishlistProduct,
  deleteWishlistProduct,
} from "../controllers/wishlist.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(requireAuth),
  asyncHandler(getWishlist),
);

router.post(
  "/:productId",
  asyncHandler(requireAuth),
  asyncHandler(addWishlistProduct),
);

router.delete(
  "/:productId",
  asyncHandler(requireAuth),
  asyncHandler(deleteWishlistProduct),
);

export default router;