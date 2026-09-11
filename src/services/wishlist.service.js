import Wishlist from "../models/wishlist.model.js";
import supabase from "../config/database.js";
import AppError from "../utils/appError.js";
import mapProduct from "../utils/productMapper.js";
import {
  findProductById,
} from "./product.service.js";

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

const parseUserId = (userId) => {
  const parsedId = Number(userId);

  if (
    !Number.isInteger(parsedId) ||
    parsedId <= 0
  ) {
    throw new AppError(
      "El identificador del usuario no es válido",
      400,
    );
  }

  return parsedId;
};

export const findWishlistByUser = async (
  userId,
) => {
  const parsedUserId = parseUserId(userId);

  const wishlist = await Wishlist.findOne({
    userId: parsedUserId,
  }).lean();

  if (
    !wishlist ||
    wishlist.items.length === 0
  ) {
    return {
      items: [],
      total: 0,
    };
  }

  const productIds = wishlist.items.map(
    (item) => item.productId,
  );

  const {
    data: products,
    error,
  } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("id", productIds)
    .eq("is_active", true);

  if (error) {
    throw new AppError(
      "No se pudieron obtener los productos de la wishlist",
      500,
    );
  }

  const productsById = new Map(
    products.map((product) => [
      Number(product.id),
      mapProduct(product),
    ]),
  );

  const items = wishlist.items
    .map((item) => {
      const product = productsById.get(
        Number(item.productId),
      );

      if (!product) {
        return null;
      }

      return {
        product,
        addedAt: item.addedAt,
      };
    })
    .filter(Boolean);

  return {
    items,
    total: items.length,
  };
};

export const addProductToWishlist = async ({
  userId,
  productId,
}) => {
  const parsedUserId = parseUserId(userId);
  const parsedProductId =
    parseProductId(productId);

  const product = await findProductById(
    parsedProductId,
  );

  let wishlist = await Wishlist.findOne({
    userId: parsedUserId,
  });

  if (!wishlist) {
    wishlist = new Wishlist({
      userId: parsedUserId,
      items: [],
    });
  }

  const productAlreadyExists =
    wishlist.items.some((item) => {
      return (
        Number(item.productId) ===
        parsedProductId
      );
    });

  if (productAlreadyExists) {
    throw new AppError(
      "El producto ya está en la wishlist",
      409,
    );
  }

  wishlist.items.push({
    productId: parsedProductId,
  });

  await wishlist.save();

  const addedItem =
    wishlist.items[
      wishlist.items.length - 1
    ];

  return {
    product,
    addedAt: addedItem.addedAt,
  };
};

export const removeProductFromWishlist =
  async ({
    userId,
    productId,
  }) => {
    const parsedUserId =
      parseUserId(userId);

    const parsedProductId =
      parseProductId(productId);

    const wishlist =
      await Wishlist.findOne({
        userId: parsedUserId,
      });

    if (!wishlist) {
      throw new AppError(
        "El producto no está en la wishlist",
        404,
      );
    }

    const itemIndex =
      wishlist.items.findIndex((item) => {
        return (
          Number(item.productId) ===
          parsedProductId
        );
      });

    if (itemIndex === -1) {
      throw new AppError(
        "El producto no está en la wishlist",
        404,
      );
    }

    const removedItem =
      wishlist.items[itemIndex];

    wishlist.items.splice(itemIndex, 1);

    await wishlist.save();

    return {
      productId: parsedProductId,
      addedAt: removedItem.addedAt,
    };
  };