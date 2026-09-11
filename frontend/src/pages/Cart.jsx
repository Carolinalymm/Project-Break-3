import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionItemId, setActionItemId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/cart");

        setCart(response.data.data.cart);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.error ||
            "No se pudo cargar el carrito"
        );
      } finally {
        setLoading(false);
      }
    };

    getCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setActionItemId(itemId);
      setError("");

      const response = await api.put(
        `/api/cart/items/${itemId}`,
        {
          quantity,
        }
      );

      setCart(response.data.data.cart);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "No se pudo actualizar la cantidad"
      );
    } finally {
      setActionItemId(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setActionItemId(itemId);
      setError("");

      const response = await api.delete(
        `/api/cart/items/${itemId}`
      );

      setCart(response.data.data.cart);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "No se pudo eliminar el producto"
      );
    } finally {
      setActionItemId(null);
    }
  };

  if (loading) {
    return <p>Cargando carrito...</p>;
  }

  if (!cart) {
    return (
      <section>
        <h1>Carrito</h1>
        {error && <p>{error}</p>}
      </section>
    );
  }

  return (
    <section>
      <h1>Carrito</h1>

      {error && <p>{error}</p>}

      {cart.items.length === 0 ? (
        <>
          <p>Tu carrito está vacío.</p>
          <Link to="/products">Ver productos</Link>
        </>
      ) : (
        <>
          {cart.items.map((item) => (
            <article key={item.id}>
              <h2>{item.product?.name}</h2>

              <p>
                Precio: {item.unitPrice.toFixed(2)} €
              </p>

              <p>
                Cantidad: {item.quantity}
              </p>

              <button
                type="button"
                onClick={() =>
                  updateQuantity(
                    item.id,
                    item.quantity - 1
                  )
                }
                disabled={
                  item.quantity <= 1 ||
                  actionItemId === item.id
                }
              >
                -
              </button>

              <button
                type="button"
                onClick={() =>
                  updateQuantity(
                    item.id,
                    item.quantity + 1
                  )
                }
                disabled={actionItemId === item.id}
              >
                +
              </button>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={actionItemId === item.id}
              >
                Eliminar
              </button>

              <p>
                Subtotal: {item.subtotal.toFixed(2)} €
              </p>
            </article>
          ))}

          <hr />

          <p>
            Productos totales: {cart.totalItems}
          </p>

          <h2>
            Total: {cart.total.toFixed(2)} €
          </h2>

          <Link to="/checkout">
            Ir al checkout
          </Link>
        </>
      )}
    </section>
  );
}

export default Cart;