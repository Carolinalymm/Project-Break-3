import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import api from "../api/api";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] =
    useState(false);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const paymentCancelled =
    searchParams.get("cancelled") === "true";

  useEffect(() => {
    const getCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/cart"
        );

        setCart(
          response.data?.data?.cart ?? null
        );
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

  const handleStripeCheckout = async () => {
    try {
      setPaymentLoading(true);
      setError("");

      const response = await api.post(
        "/api/payments/create-checkout-session"
      );

      const checkoutUrl =
        response.data?.data
          ?.checkoutSession?.url;

      if (!checkoutUrl) {
        throw new Error(
          "Stripe no devolvió una URL de pago"
        );
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          error.message ||
          "No se pudo iniciar el pago con Stripe"
      );

      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando checkout...</p>;
  }

  if (error && !cart) {
    return (
      <section>
        <h1>Checkout</h1>

        <p>{error}</p>
      </section>
    );
  }

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {
    return (
      <section>
        <h1>Checkout</h1>

        <p>
          No hay productos en el carrito.
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

      {paymentCancelled && (
        <p>
          El pago se ha cancelado. Tu
          carrito sigue disponible.
        </p>
      )}

      {error && <p>{error}</p>}

      <h2>Resumen del pedido</h2>

      {cart.items.map((item) => (
        <article key={item.id}>
          <h3>
            {item.product?.name ||
              "Producto"}
          </h3>

          <p>
            Cantidad: {item.quantity}
          </p>

          <p>
            Precio unitario:{" "}
            {Number(
              item.unitPrice
            ).toFixed(2)}{" "}
            €
          </p>

          <p>
            Subtotal:{" "}
            {Number(
              item.subtotal
            ).toFixed(2)}{" "}
            €
          </p>
        </article>
      ))}

      <hr />

      <p>
        Productos: {cart.totalItems}
      </p>

      <p>
        <strong>
          Total:{" "}
          {Number(cart.total).toFixed(2)} €
        </strong>
      </p>

      <button
        type="button"
        onClick={handleStripeCheckout}
        disabled={paymentLoading}
      >
        {paymentLoading
          ? "Conectando con Stripe..."
          : "Pagar con Stripe"}
      </button>

      <p>
        <Link to="/cart">
          Volver al carrito
        </Link>
      </p>
    </section>
  );
}

export default Checkout;