import cloudinary, {
    ensureCloudinaryConfigured,
  } from "../config/cloudinary.js";
  import AppError from "../utils/appError.js";
  
  const PRODUCT_IMAGES_FOLDER =
    "backend-react-ready/products";

  export const uploadProductImageBuffer = async (
    fileBuffer,
  ) => {
    ensureCloudinaryConfigured();
  
    if (!Buffer.isBuffer(fileBuffer)) {
      throw new AppError(
        "No se ha recibido una imagen válida",
        400,
      );
    }
  
    const uploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: PRODUCT_IMAGES_FOLDER,
              resource_type: "image",
              use_filename: false,
              unique_filename: true,
              overwrite: false,
              tags: [
                "backend-react-ready",
                "product",
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }
  
              resolve(result);
            },
          );
  
        uploadStream.end(fileBuffer);
      },
    ).catch(() => {
      throw new AppError(
        "No se pudo subir la imagen a Cloudinary",
        502,
      );
    });
  
    if (
      !uploadResult?.public_id ||
      !uploadResult?.secure_url
    ) {
      throw new AppError(
        "Cloudinary no devolvió una imagen válida",
        502,
      );
    }
  
    return {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      width: Number(uploadResult.width),
      height: Number(uploadResult.height),
      format: uploadResult.format,
      bytes: Number(uploadResult.bytes),
      resourceType: uploadResult.resource_type,
      createdAt: uploadResult.created_at,
    };
  };

  export const removeProductImage = async (
    publicId,
  ) => {
    ensureCloudinaryConfigured();
  
    if (
      typeof publicId !== "string" ||
      publicId.trim().length === 0
    ) {
      throw new AppError(
        "Debes indicar el publicId de la imagen",
        400,
      );
    }
  
    const normalizedPublicId =
      publicId.trim();
  
    if (
      !normalizedPublicId.startsWith(
        `${PRODUCT_IMAGES_FOLDER}/`,
      )
    ) {
      throw new AppError(
        "La imagen no pertenece a la carpeta de productos",
        400,
      );
    }
  
    const result = await cloudinary.uploader
      .destroy(normalizedPublicId, {
        resource_type: "image",
        invalidate: true,
      })
      .catch(() => {
        throw new AppError(
          "No se pudo eliminar la imagen de Cloudinary",
          502,
        );
      });
  
    if (result?.result === "not found") {
      throw new AppError(
        "Imagen no encontrada en Cloudinary",
        404,
      );
    }
  
    if (result?.result !== "ok") {
      throw new AppError(
        "Cloudinary no pudo eliminar la imagen",
        502,
      );
    }
  
    return {
      publicId: normalizedPublicId,
      deleted: true,
    };
  };