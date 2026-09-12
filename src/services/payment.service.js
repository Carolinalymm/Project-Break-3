import stripe from "../config/stripe.js";
import AppError from "../utils/appError.js";
import {
  findCartByUser,
} from "./cart.service.js";

const getFrontendUrl = () => {
  const frontendUrl =
    process.env.STRIPE_FRONTEND_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  return frontendUrl.replace(/\/+$/, "");
};

export const createStripeCheckoutSession =
  async ({
    userId,
    customerEmail,
  }) => {
    if (!stripe) {
      throw new AppError(
        "Stripe no está configurado correctamente",
        503,
      );
    }

    const cart = await findCartByUser(
      userId,
    );

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

            product_data: productData,

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