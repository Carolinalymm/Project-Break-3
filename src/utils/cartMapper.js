import mapProduct from "./productMapper.js";

export const mapCartItem = (item) => {
  if (!item) {
    return null;
  }

  const quantity = Number(item.quantity);
  const unitPrice = Number(item.unit_price);

  return {
    id: Number(item.id),
    productId: Number(item.product_id),
    quantity,
    unitPrice,

    subtotal: Number(
      (quantity * unitPrice).toFixed(2),
    ),

    product: item.product
      ? mapProduct(item.product)
      : null,

    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

export const mapCart = (
  cart,
  cartItems = [],
) => {
  const items = cartItems
    .map(mapCartItem)
    .filter(Boolean);

  const totalItems = items.reduce(
    (total, item) => {
      return total + item.quantity;
    },
    0,
  );

  const total = Number(
    items
      .reduce((sum, item) => {
        return sum + item.subtotal;
      }, 0)
      .toFixed(2),
  );

  return {
    id: Number(cart.id),
    userId: Number(cart.user_id),
    status: cart.status,
    items,
    totalItems,
    total,
    checkedOutAt: cart.checked_out_at,
    createdAt: cart.created_at,
    updatedAt: cart.updated_at,
  };
};