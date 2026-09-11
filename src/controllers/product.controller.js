import {
    findAllProducts,
    findProductById,
    insertProduct,
    replaceProduct,
    deactivateProduct,
  } from "../services/product.service.js";
  import {
    sendSuccess,
  } from "../utils/apiResponse.js";
  
  export const getProducts = async (
    req,
    res,
  ) => {
    const products = await findAllProducts();
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Productos obtenidos correctamente",
      data: {
        products,
      },
    });
  };
  
  export const getProduct = async (
    req,
    res,
  ) => {
    const product = await findProductById(
      req.params.id,
    );
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Producto obtenido correctamente",
      data: {
        product,
      },
    });
  };
  
  export const createProduct = async (
    req,
    res,
  ) => {
    const product = await insertProduct(
      req.body,
    );
  
    return sendSuccess(res, {
      statusCode: 201,
      message: "Producto creado correctamente",
      data: {
        product,
      },
    });
  };

  export const updateProduct = async (
    req,
    res,
  ) => {
    const product = await replaceProduct(
      req.params.id,
      req.body,
    );
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Producto actualizado correctamente",
      data: {
        product,
      },
    });
  };
  
  export const deleteProduct = async (
    req,
    res,
  ) => {
    const product = await deactivateProduct(
      req.params.id,
    );
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Producto eliminado correctamente",
      data: {
        product,
      },
    });
  };