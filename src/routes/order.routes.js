import { Router } from "express";

import {
  getOrders,
  getOrder,
} from "../controllers/order.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.use(
  asyncHandler(requireAuth),
);


router.get(
  "/",
  asyncHandler(getOrders),
);

router.get(
  "/:orderId",
  asyncHandler(getOrder),
);

export default router;