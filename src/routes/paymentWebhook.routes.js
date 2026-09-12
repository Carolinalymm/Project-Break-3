import {
    Router,
  } from "express";
  
  import {
    handleStripeWebhook,
  } from "../controllers/paymentWebhook.controller.js";
  
  import asyncHandler from "../utils/asyncHandler.js";
  
  const router = Router();
  
  router.post(
    "/",
    asyncHandler(
      handleStripeWebhook,
    ),
  );
  
  export default router;