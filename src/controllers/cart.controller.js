import {
    findCartByUser,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
  } from "../services/cart.service.js";
  import {
    sendSuccess,
  } from "../utils/apiResponse.js";

  export const getCart = async (
    req,
    res,
  ) => {
    const cart = await findCartByUser(
      req.user.id,
    );
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Carrito obtenido correctamente",
      data: {
        cart,
      },
    });
  };

  export const addCartItem = async (
    req,
    res,
  ) => {
    const result = await addItemToCart({
      userId: req.user.id,
      productId: req.body.productId,
      quantity: req.body.quantity ?? 1,
    });
  
    return sendSuccess(res, {
      statusCode: result.created
        ? 201
        : 200,
  
      message: result.created
        ? "Producto añadido al carrito correctamente"
        : "Cantidad del producto actualizada correctamente",
  
      data: {
        cart: result.cart,
      },
    });
  };
  export const updateCartItem = async (
    req,
    res,
  ) => {
    const cart =
      await updateCartItemQuantity({
        userId: req.user.id,
        itemId: req.params.itemId,
        quantity: req.body.quantity,
      });
  
    return sendSuccess(res, {
      statusCode: 200,
      message:
        "Cantidad actualizada correctamente",
      data: {
        cart,
      },
    });
  };
  
  export const deleteCartItem = async (
    req,
    res,
  ) => {
    const cart = await removeItemFromCart({
      userId: req.user.id,
      itemId: req.params.itemId,
    });
  
    return sendSuccess(res, {
      statusCode: 200,
      message:
        "Producto eliminado del carrito correctamente",
      data: {
        cart,
      },
    });
  };