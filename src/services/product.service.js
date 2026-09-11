import supabase from "../config/database.js";
import AppError from "../utils/appError.js";
import mapProduct from "../utils/productMapper.js";

const PRODUCT_COLUMNS = `
  id,
  name,
  description,
  category,
  price,
  stock,
  image_url,
  is_active,
  created_at,
  updated_at
`;

const parseProductId = (productId) => {
  const parsedId = Number(productId);

  if (
    !Number.isInteger(parsedId) ||
    parsedId <= 0
  ) {
    throw new AppError(
      "El identificador del producto no es válido",
      400,
    );
  }

  return parsedId;
};

const normalizeImageUrl = (imageUrl) => {
  if (
    imageUrl === undefined ||
    imageUrl === null ||
    imageUrl === ""
  ) {
    return null;
  }

  if (typeof imageUrl !== "string") {
    throw new AppError(
      "La URL de la imagen no es válida",
      400,
    );
  }

  try {
    const parsedUrl = new URL(imageUrl);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      throw new Error();
    }

    return imageUrl.trim();
  } catch {
    throw new AppError(
      "La URL de la imagen no es válida",
      400,
    );
  }
};

const validateAndNormalizeProduct = ({
  name,
  description,
  category,
  price,
  stock,
  imageUrl,
} = {}) => {
  if (
    typeof name !== "string" ||
    name.trim().length < 2
  ) {
    throw new AppError(
      "El nombre debe tener al menos 2 caracteres",
      400,
    );
  }

  if (
    typeof description !== "string" ||
    description.trim().length < 5
  ) {
    throw new AppError(
      "La descripción debe tener al menos 5 caracteres",
      400,
    );
  }

  if (
    typeof category !== "string" ||
    category.trim().length < 2
  ) {
    throw new AppError(
      "La categoría debe tener al menos 2 caracteres",
      400,
    );
  }

  if (
    price === "" ||
    price === null ||
    price === undefined
  ) {
    throw new AppError(
      "El precio es obligatorio",
      400,
    );
  }

  const normalizedPrice = Number(price);

  if (
    !Number.isFinite(normalizedPrice) ||
    normalizedPrice < 0
  ) {
    throw new AppError(
      "El precio debe ser un número igual o superior a 0",
      400,
    );
  }

  const normalizedStock = Number(stock);

  if (
    stock === "" ||
    stock === null ||
    stock === undefined ||
    !Number.isInteger(normalizedStock) ||
    normalizedStock < 0
  ) {
    throw new AppError(
      "El stock debe ser un número entero igual o superior a 0",
      400,
    );
  }

  return {
    name: name.trim(),
    description: description.trim(),
    category: category.trim(),
    price: normalizedPrice,
    stock: normalizedStock,
    image_url: normalizeImageUrl(imageUrl),
  };
};

export const findAllProducts = async () => {
  const { data: products, error } =
    await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_active", true)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw new AppError(
      "No se pudieron obtener los productos",
      500,
    );
  }

  return products.map(mapProduct);
};

export const findProductById = async (
  productId,
) => {
  const parsedId = parseProductId(productId);

  const { data: product, error } =
    await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("id", parsedId)
      .eq("is_active", true)
      .maybeSingle();

  if (error) {
    throw new AppError(
      "No se pudo consultar el producto",
      500,
    );
  }

  if (!product) {
    throw new AppError(
      "Producto no encontrado",
      404,
    );
  }

  return mapProduct(product);
};

export const insertProduct = async (
  productData,
) => {
  const normalizedProduct =
    validateAndNormalizeProduct(productData);

  const { data: product, error } =
    await supabase
      .from("products")
      .insert({
        ...normalizedProduct,
        is_active: true,
      })
      .select(PRODUCT_COLUMNS)
      .single();

  if (error) {
    throw new AppError(
      "No se pudo crear el producto",
      500,
    );
  }

  return mapProduct(product);
};

export const replaceProduct = async (
  productId,
  productData,
) => {
  const parsedId = parseProductId(productId);

  const normalizedProduct =
    validateAndNormalizeProduct(productData);

  const { data: product, error } =
    await supabase
      .from("products")
      .update(normalizedProduct)
      .eq("id", parsedId)
      .eq("is_active", true)
      .select(PRODUCT_COLUMNS)
      .maybeSingle();

  if (error) {
    throw new AppError(
      "No se pudo actualizar el producto",
      500,
    );
  }

  if (!product) {
    throw new AppError(
      "Producto no encontrado",
      404,
    );
  }

  return mapProduct(product);
};

export const deactivateProduct = async (
  productId,
) => {
  const parsedId = parseProductId(productId);

  const { data: product, error } =
    await supabase
      .from("products")
      .update({
        is_active: false,
      })
      .eq("id", parsedId)
      .eq("is_active", true)
      .select(PRODUCT_COLUMNS)
      .maybeSingle();

  if (error) {
    throw new AppError(
      "No se pudo eliminar el producto",
      500,
    );
  }

  if (!product) {
    throw new AppError(
      "Producto no encontrado",
      404,
    );
  }

  return mapProduct(product);
};