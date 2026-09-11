import supabase from "../config/database.js";
import AppError from "../utils/appError.js";
import { mapCart } from "../utils/cartMapper.js";
import {
  findProductById,
} from "./product.service.js";

const CART_COLUMNS = `
  id,
  user_id,
  status,
  checked_out_at,
  created_at,
  updated_at
`;

const CART_ITEM_COLUMNS = `
  id,
  cart_id,
  product_id,
  quantity,
  unit_price,
  created_at,
  updated_at,
  product:products (
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
  )
`;

const parsePositiveId = (
  value,
  fieldName,
) => {
  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    throw new AppError(
      `El identificador de ${fieldName} no es válido`,
      400,
    );
  }

  return parsedValue;
};

const parseQuantity = (quantity) => {
  const parsedQuantity = Number(quantity);

  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity <= 0
  ) {
    throw new AppError(
      "La cantidad debe ser un número entero superior a 0",
      400,
    );
  }

  return parsedQuantity;
};

const findActiveCart = async (userId) => {
  const parsedUserId = parsePositiveId(
    userId,
    "usuario",
  );

  const {
    data: cart,
    error,
  } = await supabase
    .from("carts")
    .select(CART_COLUMNS)
    .eq("user_id", parsedUserId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (error) {
    throw new AppError(
      "No se pudo consultar el carrito",
      500,
    );
  }

  return cart;
};

const createActiveCart = async (
  userId,
) => {
  const parsedUserId = parsePositiveId(
    userId,
    "usuario",
  );

  const {
    data: cart,
    error,
  } = await supabase
    .from("carts")
    .insert({
      user_id: parsedUserId,
      status: "ACTIVE",
    })
    .select(CART_COLUMNS)
    .single();

  if (error?.code === "23505") {
    const existingCart =
      await findActiveCart(parsedUserId);

    if (existingCart) {
      return existingCart;
    }
  }

  if (error) {
    throw new AppError(
      "No se pudo crear el carrito",
      500,
    );
  }

  return cart;
};

const getOrCreateActiveCart = async (
  userId,
) => {
  const existingCart =
    await findActiveCart(userId);

  if (existingCart) {
    return existingCart;
  }

  return createActiveCart(userId);
};

const findCartItems = async (cartId) => {
  const parsedCartId = parsePositiveId(
    cartId,
    "carrito",
  );

  const {
    data: items,
    error,
  } = await supabase
    .from("cart_items")
    .select(CART_ITEM_COLUMNS)
    .eq("cart_id", parsedCartId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new AppError(
      "No se pudieron obtener los productos del carrito",
      500,
    );
  }

  return items;
};

export const findCartByUser = async (
  userId,
) => {
  const cart =
    await getOrCreateActiveCart(userId);

  const items = await findCartItems(
    cart.id,
  );

  return mapCart(cart, items);
};

export const addItemToCart = async ({
  userId,
  productId,
  quantity = 1,
}) => {
  const parsedProductId =
    parsePositiveId(
      productId,
      "producto",
    );

  const parsedQuantity =
    parseQuantity(quantity);

  const product = await findProductById(
    parsedProductId,
  );

  if (product.stock <= 0) {
    throw new AppError(
      "El producto no tiene stock disponible",
      409,
    );
  }

  if (parsedQuantity > product.stock) {
    throw new AppError(
      `Solo hay ${product.stock} unidades disponibles`,
      409,
    );
  }

  const cart =
    await getOrCreateActiveCart(userId);

  const {
    data: existingItem,
    error: existingItemError,
  } = await supabase
    .from("cart_items")
    .select(
      "id, cart_id, product_id, quantity, unit_price",
    )
    .eq("cart_id", cart.id)
    .eq("product_id", product.id)
    .maybeSingle();

  if (existingItemError) {
    throw new AppError(
      "No se pudo comprobar el producto del carrito",
      500,
    );
  }

  let created = false;

  if (existingItem) {
    const newQuantity =
      Number(existingItem.quantity) +
      parsedQuantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        `Solo hay ${product.stock} unidades disponibles`,
        409,
      );
    }

    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: newQuantity,

        unit_price: product.price,
      })
      .eq("id", existingItem.id)
      .eq("cart_id", cart.id);

    if (error) {
      throw new AppError(
        "No se pudo actualizar el producto del carrito",
        500,
      );
    }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cart.id,
        product_id: product.id,
        quantity: parsedQuantity,
        unit_price: product.price,
      });

    if (error) {
      throw new AppError(
        "No se pudo añadir el producto al carrito",
        500,
      );
    }

    created = true;
  }

  const updatedCart =
    await findCartByUser(userId);

  return {
    cart: updatedCart,
    created,
  };
};

export const updateCartItemQuantity =
  async ({
    userId,
    itemId,
    quantity,
  }) => {
    const parsedItemId =
      parsePositiveId(
        itemId,
        "elemento del carrito",
      );

    const parsedQuantity =
      parseQuantity(quantity);

    const cart =
      await findActiveCart(userId);

    if (!cart) {
      throw new AppError(
        "No tienes un carrito activo",
        404,
      );
    }

    const {
      data: item,
      error: itemError,
    } = await supabase
      .from("cart_items")
      .select(
        "id, cart_id, product_id, quantity",
      )
      .eq("id", parsedItemId)
      .eq("cart_id", cart.id)
      .maybeSingle();

    if (itemError) {
      throw new AppError(
        "No se pudo consultar el elemento del carrito",
        500,
      );
    }

    if (!item) {
      throw new AppError(
        "Elemento del carrito no encontrado",
        404,
      );
    }

    const product = await findProductById(
      item.product_id,
    );

    if (parsedQuantity > product.stock) {
      throw new AppError(
        `Solo hay ${product.stock} unidades disponibles`,
        409,
      );
    }

    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: parsedQuantity,
        unit_price: product.price,
      })
      .eq("id", parsedItemId)
      .eq("cart_id", cart.id);

    if (error) {
      throw new AppError(
        "No se pudo actualizar la cantidad",
        500,
      );
    }

    return findCartByUser(userId);
  };

export const removeItemFromCart =
  async ({
    userId,
    itemId,
  }) => {
    const parsedItemId =
      parsePositiveId(
        itemId,
        "elemento del carrito",
      );

    const cart =
      await findActiveCart(userId);

    if (!cart) {
      throw new AppError(
        "No tienes un carrito activo",
        404,
      );
    }

    const {
      data: deletedItems,
      error,
    } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", parsedItemId)
      .eq("cart_id", cart.id)
      .select("id");

    if (error) {
      throw new AppError(
        "No se pudo eliminar el producto del carrito",
        500,
      );
    }

    if (
      !deletedItems ||
      deletedItems.length === 0
    ) {
      throw new AppError(
        "Elemento del carrito no encontrado",
        404,
      );
    }

    return findCartByUser(userId);
  };