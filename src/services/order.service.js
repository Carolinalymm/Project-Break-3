import supabase from "../config/database.js";
import AppError from "../utils/appError.js";
import {
  mapOrder,
} from "../utils/orderMapper.js";

const ORDER_COLUMNS = `
  id,
  user_id,
  cart_id,
  total,
  status,
  created_at,
  updated_at,
  items:order_items (
    id,
    order_id,
    product_id,
    product_name,
    quantity,
    unit_price,
    subtotal,
    created_at
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

const throwCheckoutError = (error) => {
  const errorMessage =
    error?.message ||
    "No se pudo completar el checkout";

  if (
    errorMessage.includes(
      "No tienes un carrito activo",
    )
  ) {
    throw new AppError(
      "No tienes un carrito activo",
      404,
    );
  }

  if (
    errorMessage.includes(
      "El carrito está vacío",
    )
  ) {
    throw new AppError(
      "El carrito está vacío",
      409,
    );
  }

  if (
    errorMessage.includes(
      "ya no está disponible",
    )
  ) {
    throw new AppError(
      errorMessage,
      409,
    );
  }

  if (
    errorMessage.includes(
      "Stock insuficiente",
    )
  ) {
    throw new AppError(
      errorMessage,
      409,
    );
  }

  throw new AppError(
    "No se pudo completar el checkout",
    500,
  );
};

export const findOrderById = async ({
  userId,
  orderId,
}) => {
  const parsedUserId = parsePositiveId(
    userId,
    "usuario",
  );

  const parsedOrderId = parsePositiveId(
    orderId,
    "pedido",
  );

  const {
    data: order,
    error,
  } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("id", parsedOrderId)
    .eq("user_id", parsedUserId)
    .maybeSingle();

  if (error) {
    throw new AppError(
      "No se pudo obtener el pedido",
      500,
    );
  }

  if (!order) {
    throw new AppError(
      "Pedido no encontrado",
      404,
    );
  }

  return mapOrder(order);
};

export const findOrdersByUser = async (
  userId,
) => {
  const parsedUserId = parsePositiveId(
    userId,
    "usuario",
  );

  const {
    data: orders,
    error,
  } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("user_id", parsedUserId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new AppError(
      "No se pudieron obtener los pedidos",
      500,
    );
  }

  return (orders || []).map(mapOrder);
};

export const checkoutUserCart = async (
  userId,
) => {
  const parsedUserId = parsePositiveId(
    userId,
    "usuario",
  );

  const {
    data: orderId,
    error,
  } = await supabase.rpc(
    "checkout_cart",
    {
      p_user_id: parsedUserId,
    },
  );

  if (error) {
    throwCheckoutError(error);
  }

  const parsedOrderId = Number(orderId);

  if (
    !Number.isInteger(parsedOrderId) ||
    parsedOrderId <= 0
  ) {
    throw new AppError(
      "El checkout terminó sin devolver un pedido válido",
      500,
    );
  }

  return findOrderById({
    userId: parsedUserId,
    orderId: parsedOrderId,
  });
};