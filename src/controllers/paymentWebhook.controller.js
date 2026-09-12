import stripe from "../config/stripe.js";

import AppError from "../utils/appError.js";

import {
  fulfillStripeCheckoutSession,
} from "../services/payment.service.js";

export const handleStripeWebhook =
  async (
    req,
    res,
  ) => {
    if (!stripe) {
      throw new AppError(
        "Stripe no está configurado correctamente",
        503,
      );
    }

    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new AppError(
        "El webhook de Stripe no está configurado",
        503,
      );
    }

    const signature =
      req.headers[
        "stripe-signature"
      ];

    if (!signature) {
      return res
        .status(400)
        .json({
          error:
            "Falta la firma de Stripe",
        });
    }

    let event;

    try {
      event =
        stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret,
        );
    } catch (error) {
      console.warn(
        "Firma de webhook Stripe no válida:",
        error.message,
      );

      return res
        .status(400)
        .json({
          error:
            "Firma de Stripe no válida",
        });
    }

    if (
      event.type ===
        "checkout.session.completed" ||
      event.type ===
        "checkout.session.async_payment_succeeded"
    ) {
      await fulfillStripeCheckoutSession(
        event.data.object.id,
      );
    }

    return res
      .status(200)
      .json({
        received: true,
      });
  };