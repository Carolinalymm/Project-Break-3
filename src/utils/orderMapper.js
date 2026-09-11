export const mapOrderItem = (item) => {
    if (!item) {
      return null;
    }
  
    return {
      id: Number(item.id),
      orderId: Number(item.order_id),
      productId: Number(item.product_id),
      productName: item.product_name,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
      subtotal: Number(item.subtotal),
      createdAt: item.created_at,
    };
  };
  
  export const mapOrder = (order) => {
    if (!order) {
      return null;
    }
  
    const items = Array.isArray(order.items)
      ? order.items
          .map(mapOrderItem)
          .filter(Boolean)
      : [];
  
    const totalItems = items.reduce(
      (total, item) => {
        return total + item.quantity;
      },
      0,
    );
  
    return {
      id: Number(order.id),
      userId: Number(order.user_id),
      cartId: Number(order.cart_id),
      total: Number(order.total),
      status: order.status,
      totalItems,
      items,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };
  };