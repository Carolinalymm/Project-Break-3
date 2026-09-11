import {
    uploadProductImageBuffer,
    removeProductImage,
  } from "../services/upload.service.js";
  import AppError from "../utils/appError.js";
  import {
    sendSuccess,
  } from "../utils/apiResponse.js";

  export const uploadProductImage = async (
    req,
    res,
  ) => {
    if (!req.file) {
      throw new AppError(
        'Debes enviar una imagen en el campo "image"',
        400,
      );
    }
  
    const image =
      await uploadProductImageBuffer(
        req.file.buffer,
      );
  
    return sendSuccess(res, {
      statusCode: 201,
      message:
        "Imagen subida correctamente",
      data: {
        image,
      },
    });
  };

  export const deleteProductImage = async (
    req,
    res,
  ) => {
    const image = await removeProductImage(
      req.body.publicId,
    );
  
    return sendSuccess(res, {
      statusCode: 200,
      message:
        "Imagen eliminada correctamente",
      data: {
        image,
      },
    });
  };