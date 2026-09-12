import stripe from "../config/stripe.js";
import AppError from "../utils/appError.js";

import {
  findCartByUser,
} from "./cart.service.js";

import {
  checkoutUserCart,
  findOrderByCartId,
  markOrderAsPaid,
} from "./order.service.js";

const getFrontendUrl = () => {
  const frontendUrl =
    process.env.STRIPE_FRONTEND_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  return frontendUrl.replace(/\/+$/, "");
};

const ensureStripeConfigured = () => {
  if (!stripe) {
    throw new AppError(
      "Stripe no está configurado correctamente",
      503,
    );
  }
};

const parseMetadataId = (
  value,
  fieldName,
) => {
  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    throw new AppError(
      `Stripe no devolvió un identificador válido de ${fieldName}`,
      500,
    );
  }

  return parsedValue;
};

const validateCartForPayment = (cart) => {
  if (
    !cart.items ||
    cart.items.length === 0
  ) {
    throw new AppError(
      "El carrito está vacío",
      409,
    );
  }

  for (const item of cart.items) {
    if (!item.product) {
      throw new AppError(
        "Uno de los productos del carrito ya no existe",
        409,
      );
    }

    if (!item.product.isActive) {
      throw new AppError(
        `El producto "${item.product.name}" ya no está disponible`,
        409,
      );
    }

    if (
      item.quantity >
      item.product.stock
    ) {
      throw new AppError(
        `Stock insuficiente para "${item.product.name}"`,
        409,
      );
    }
  }
};

export const createStripeCheckoutSession =
  async ({
    userId,
    customerEmail,
  }) => {
    ensureStripeConfigured();

    const cart =
      await findCartByUser(userId);

    validateCartForPayment(cart);

    const lineItems = cart.items.map(
      (item) => {
        const productData = {
          name: item.product.name,
        };

        if (item.product.description) {
          productData.description =
            item.product.description;
        }

        if (
          item.product.imageUrl?.startsWith(
            "https://",
          )
        ) {
          productData.images = [
            item.product.imageUrl,
          ];
        }

        return {
          price_data: {
            currency: "eur",

            product_data:
              productData,

            unit_amount: Math.round(
              item.product.price * 100,
            ),
          },

          quantity: item.quantity,
        };
      },
    );

    const frontendUrl =
      getFrontendUrl();

    try {
      const session =
        await stripe.checkout.sessions.create({
          mode: "payment",

          line_items: lineItems,

          success_url:
            `${frontendUrl}/checkout/success` +
            "?session_id={CHECKOUT_SESSION_ID}",

          cancel_url:
            `${frontendUrl}/checkout` +
            "?cancelled=true",

          customer_email:
            customerEmail || undefined,

          client_reference_id:
            String(userId),

          metadata: {
            userId: String(userId),
            cartId: String(cart.id),
          },

          payment_intent_data: {
            metadata: {
              userId: String(userId),
              cartId: String(cart.id),
            },
          },
        });

      if (!session.url) {
        throw new AppError(
          "Stripe no devolvió una URL de pago",
          502,
        );
      }

      return {
        sessionId: session.id,
        url: session.url,
        cartId: cart.id,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error(
        "Error creando sesión Stripe:",
        error,
      );

      throw new AppError(
        "No se pudo crear la sesión de pago",
        502,
      );
    }
  };

export const fulfillStripeCheckoutSession =
  async (sessionId) => {
    ensureStripeConfigured();

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
      );

    if (
      session.payment_status !== "paid"
    ) {
      return {
        fulfilled: false,
        paymentStatus:
          session.payment_status,
        order: null,
      };
    }

    const userId = parseMetadataId(
      session.metadata?.userId ||
        session.client_reference_id,
      "usuario",
    );

    const cartId = parseMetadataId(
      session.metadata?.cartId,
      "carrito",
    );

    /*
     * Stripe puede enviar un mismo webhook
     * más de una vez.
     *
     * Si este carrito ya generó un pedido,
     * no volvemos a ejecutar checkout.
     */
    const existingOrder =
      await findOrderByCartId(cartId);

    if (existingOrder) {
      if (
        existingOrder.status === "PAID"
      ) {
        return {
          fulfilled: true,
          paymentStatus:
            session.payment_status,
          order: existingOrder,
        };
      }

      const paidOrder =
        await markOrderAsPaid(
          existingOrder.id,
        );

      return {
        fulfilled: true,
        paymentStatus:
          session.payment_status,
        order: paidOrder,
      };
    }

    const cart =
      await findCartByUser(userId);

    if (cart.id !== cartId) {
      throw new AppError(
        "El carrito pagado no coincide con el carrito activo",
        409,
      );
    }

    const stripeAmount =
      Number(session.amount_total);

    const cartAmount =
      Math.round(
        Number(cart.total) * 100,
      );

    if (
      !Number.isInteger(stripeAmount) ||
      stripeAmount !== cartAmount
    ) {
      throw new AppError(
        "El importe pagado no coincide con el total del carrito",
        409,
      );
    }

    const order =
      await checkoutUserCart(userId);

    if (order.cartId !== cartId) {
      throw new AppError(
        "El pedido generado no coincide con el carrito pagado",
        500,
      );
    }

    const paidOrder =
      await markOrderAsPaid(
        order.id,
      );

    return {
      fulfilled: true,
      paymentStatus:
        session.payment_status,
      order: paidOrder,
    };
  };