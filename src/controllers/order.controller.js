import {
    checkoutUserCart,
    findOrdersByUser,
    findOrderById,
  } from "../services/order.service.js";
  import {
    sendSuccess,
  } from "../utils/apiResponse.js";

  export const checkoutCart = async (
    req,
    res,
  ) => {
    const order = await checkoutUserCart(
      req.user.id,
    );
  
    return sendSuccess(res, {
      statusCode: 201,
      message: "Pedido creado correctamente",
      data: {
        order,
      },
    });
  };
  
  export const getOrders = async (
    req,
    res,
  ) => {
    const orders = await findOrdersByUser(
      req.user.id,
    );
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Pedidos obtenidos correctamente",
      data: {
        orders,
        total: orders.length,
      },
    });
  };
  
  export const getOrder = async (
    req,
    res,
  ) => {
    const order = await findOrderById({
      userId: req.user.id,
      orderId: req.params.orderId,
    });
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Pedido obtenido correctamente",
      data: {
        order,
      },
    });
  };