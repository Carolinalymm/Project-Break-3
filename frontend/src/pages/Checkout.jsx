import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      setError("");

      const response = await api.post(
        "/api/cart/checkout"
      );

      setOrder(response.data.data.order);
      setCart(null);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "No se pudo completar el checkout"
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <p>Cargando checkout...</p>;
  }

  if (order) {
    return (
      <section>
        <h1>Pedido confirmado</h1>

        <p>
          Tu pedido se ha creado correctamente.
        </p>

        <p>
          Número de pedido: {order.id}
        </p>

        <p>
          Estado: {order.status}
        </p>

        <p>
          Productos: {order.totalItems}
        </p>

        <h2>
          Total: {order.total.toFixed(2)} €
        </h2>

        <h3>Resumen del pedido</h3>

        {order.items.map((item) => (
          <article key={item.id}>
            <h4>{item.productName}</h4>

            <p>
              Cantidad: {item.quantity}
            </p>

            <p>
              Precio unitario:{" "}
              {item.unitPrice.toFixed(2)} €
            </p>

            <p>
              Subtotal:{" "}
              {item.subtotal.toFixed(2)} €
            </p>
          </article>
        ))}

        <Link to="/products">
          Seguir comprando
        </Link>
      </section>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <section>
        <h1>Checkout</h1>

        {error && <p>{error}</p>}

        <p>
          No tienes productos en el carrito.
        </p>

        <Link to="/products">
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Checkout</h1>

      {error && <p>{error}</p>}

      <h2>Resumen del pedido</h2>

      {cart.items.map((item) => (
        <article key={item.id}>
          <h3>{item.product?.name}</h3>

          <p>
            Cantidad: {item.quantity}
          </p>

          <p>
            Precio unitario:{" "}
            {item.unitPrice.toFixed(2)} €
          </p>

          <p>
            Subtotal:{" "}
            {item.subtotal.toFixed(2)} €
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

      <button
        type="button"
        onClick={handleCheckout}
        disabled={processing}
      >
        {processing
          ? "Procesando pedido..."
          : "Confirmar pedido"}
      </button>

      {" "}

      <Link to="/cart">
        Volver al carrito
      </Link>
    </section>
  );
}

export default Checkout;