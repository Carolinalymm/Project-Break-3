import { Router } from "express";

import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cart.controller.js";
import {
  checkoutCart,
} from "../controllers/order.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.use(
  asyncHandler(requireAuth),
);

router.get(
  "/",
  asyncHandler(getCart),
);

router.post(
  "/checkout",
  asyncHandler(checkoutCart),
);

router.post(
  "/items",
  asyncHandler(addCartItem),
);

router.put(
  "/items/:itemId",
  asyncHandler(updateCartItem),
);

router.delete(
  "/items/:itemId",
  asyncHandler(deleteCartItem),
);

export default router;