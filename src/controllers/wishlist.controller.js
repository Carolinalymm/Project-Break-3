import {
    findWishlistByUser,
    addProductToWishlist,
    removeProductFromWishlist,
  } from "../services/wishlist.service.js";
  import {
    sendSuccess,
  } from "../utils/apiResponse.js";
  
  export const getWishlist = async (
    req,
    res,
  ) => {
    const wishlist =
      await findWishlistByUser(
        req.user.id,
      );
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Wishlist obtenida correctamente",
      data: {
        wishlist,
      },
    });
  };
  
  export const addWishlistProduct = async (
    req,
    res,
  ) => {
    const item =
      await addProductToWishlist({
        userId: req.user.id,
        productId: req.params.productId,
      });
  
    return sendSuccess(res, {
      statusCode: 201,
      message:
        "Producto añadido a la wishlist correctamente",
      data: {
        item,
      },
    });
  };

  export const deleteWishlistProduct =
    async (
      req,
      res,
    ) => {
      const removedItem =
        await removeProductFromWishlist({
          userId: req.user.id,
          productId:
            req.params.productId,
        });
  
      return sendSuccess(res, {
        statusCode: 200,
        message:
          "Producto eliminado de la wishlist correctamente",
        data: {
          removedItem,
        },
      });
    };