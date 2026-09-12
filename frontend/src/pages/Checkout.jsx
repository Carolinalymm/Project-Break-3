import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import api from "../api/api";

import "./Checkout.css";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] =
    useState(true);

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [searchParams] =
    useSearchParams();

  const paymentCancelled =
    searchParams.get("cancelled") ===
    "true";

  useEffect(() => {
    const getCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get("/api/cart");

        setCart(
          response.data?.data?.cart ??
            null
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

  const handleStripeCheckout =
    async () => {
      try {
        setPaymentLoading(true);
        setError("");

        const response =
          await api.post(
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

        window.location.assign(
          checkoutUrl
        );
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
    return (
      <section className="checkout-page">
        <div className="checkout-loading">
          Cargando checkout...
        </div>
      </section>
    );
  }

  if (error && !cart) {
    return (
      <section className="checkout-page">
        <h1>Checkout</h1>

        <p className="error-message">
          {error}
        </p>
      </section>
    );
  }

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {
    return (
      <section className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">
            🛍️
          </div>

          <h1>No hay productos</h1>

          <p>
            Tu carrito está vacío.
            Añade algún producto antes
            de continuar con el pago.
          </p>

          <Link
            to="/products"
            className="checkout-products-link"
          >
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <header className="checkout-header">
        <span className="checkout-eyebrow">
          Finalizar compra
        </span>

        <h1>Checkout</h1>

        <p>
          Revisa tu pedido y continúa
          con el pago seguro mediante
          Stripe.
        </p>
      </header>

      {paymentCancelled && (
        <p className="checkout-cancelled-message">
          El pago se ha cancelado.
          Tu carrito sigue disponible
          y puedes intentarlo de nuevo.
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="checkout-layout">
        <div className="checkout-order">
          <div className="checkout-order-header">
            <div>
              <span className="checkout-section-kicker">
                Pedido
              </span>

              <h2>
                Resumen del pedido
              </h2>
            </div>

            <span className="checkout-items-count">
              {cart.totalItems}{" "}
              {cart.totalItems === 1
                ? "producto"
                : "productos"}
            </span>
          </div>

          <div className="checkout-items">
            {cart.items.map((item) => (
              <article
                key={item.id}
                className="checkout-item"
              >
                <div className="checkout-item-image-wrapper">
                  {item.product
                    ?.imageUrl ? (
                    <img
                      src={
                        item.product
                          .imageUrl
                      }
                      alt={
                        item.product
                          ?.name ||
                        "Producto"
                      }
                      className="checkout-item-image"
                    />
                  ) : (
                    <span className="checkout-item-no-image">
                      Sin imagen
                    </span>
                  )}
                </div>

                <div className="checkout-item-content">
                  <div className="checkout-item-top">
                    <div>
                      {item.product
                        ?.category && (
                        <span className="checkout-item-category">
                          {
                            item.product
                              .category
                          }
                        </span>
                      )}

                      <h3>
                        {item.product
                          ?.name ||
                          "Producto"}
                      </h3>
                    </div>

                    <strong className="checkout-item-subtotal">
                      {Number(
                        item.subtotal
                      ).toFixed(2)}{" "}
                      €
                    </strong>
                  </div>

                  <div className="checkout-item-meta">
                    <span>
                      Cantidad:{" "}
                      <strong>
                        {item.quantity}
                      </strong>
                    </span>

                    <span>
                      Precio unitario:{" "}
                      <strong>
                        {Number(
                          item.unitPrice
                        ).toFixed(2)}{" "}
                        €
                      </strong>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="checkout-summary">
          <span className="checkout-section-kicker">
            Pago
          </span>

          <h2>Resumen</h2>

          <div className="checkout-summary-row">
            <span>Productos</span>

            <strong>
              {cart.totalItems}
            </strong>
          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-summary-total">
            <span>Total</span>

            <strong>
              {Number(
                cart.total
              ).toFixed(2)}{" "}
              €
            </strong>
          </div>

          <div className="checkout-security-box">
            <span className="checkout-security-icon">
              🔒
            </span>

            <div>
              <strong>
                Pago seguro
              </strong>

              <p>
                Serás redirigido a
                Stripe para completar
                el pago de forma segura.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="button-primary checkout-pay-button"
            onClick={
              handleStripeCheckout
            }
            disabled={
              paymentLoading
            }
          >
            {paymentLoading
              ? "Conectando con Stripe..."
              : `Pagar ${Number(
                  cart.total
                ).toFixed(2)} €`}
          </button>

          <Link
            to="/cart"
            className="checkout-back-link"
          >
            ← Volver al carrito
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;