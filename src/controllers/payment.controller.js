import {
    createStripeCheckoutSession,
  } from "../services/payment.service.js";
  
  import {
    sendSuccess,
  } from "../utils/apiResponse.js";
  
  export const createCheckoutSession =
    async (
      req,
      res,
    ) => {
      const checkoutSession =
        await createStripeCheckoutSession({
          userId: req.user.id,
          customerEmail:
            req.user.email,
        });
  
      return sendSuccess(res, {
        statusCode: 201,
        message:
          "Sesión de pago creada correctamente",
        data: {
          checkoutSession,
        },
      });
    };