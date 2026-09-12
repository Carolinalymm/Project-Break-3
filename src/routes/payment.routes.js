import {
    Router,
  } from "express";
  
  import {
    createCheckoutSession,
  } from "../controllers/payment.controller.js";
  
  import requireAuth from "../middlewares/auth.middleware.js";
  
  import asyncHandler from "../utils/asyncHandler.js";
  
  const router = Router();
  
  router.use(
    asyncHandler(requireAuth),
  );
  
  router.post(
    "/create-checkout-session",
    asyncHandler(
      createCheckoutSession,
    ),
  );
  
  export default router;