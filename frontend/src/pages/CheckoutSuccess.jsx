import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import api from "../api/api";

import "./CheckoutSuccess.css";

function CheckoutSuccess() {
  const [searchParams] =
    useSearchParams();

  const sessionId =
    searchParams.get("session_id");

  const [order, setOrder] =
    useState(null);

  const [checking, setChecking] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const checkOrder = async () => {
      try {
        setChecking(true);
        setError("");

        for (
          let attempt = 0;
          attempt < 5;
          attempt += 1
        ) {
          const response =
            await api.get(
              "/api/orders"
            );

          const orders =
            response.data?.data
              ?.orders ?? [];

          const latestOrder =
            orders[0] ?? null;

          if (
            latestOrder &&
            latestOrder.status ===
              "PAID"
          ) {
            if (!cancelled) {
              setOrder(
                latestOrder
              );
            }

            return;
          }

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1500
              )
          );
        }

        if (!cancelled) {
          setError(
            "El pago se ha recibido, pero el pedido todavía se está procesando."
          );
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            error.response?.data
              ?.error ||
              "No se pudo comprobar el estado del pedido"
          );
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    if (sessionId) {
      checkOrder();
    } else {
      setError(
        "No se ha recibido el identificador de la sesión de pago."
      );

      setChecking(false);
    }

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <section className="checkout-success-page">
      <div className="checkout-success-card">
        {checking && (
          <div className="checkout-success-checking">
            <div className="checkout-success-spinner" />

            <span className="checkout-success-eyebrow">
              Procesando
            </span>

            <h1>
              Confirmando tu pago
            </h1>

            <p>
              Estamos esperando la
              confirmación de Stripe.
              Esto puede tardar unos
              segundos.
            </p>
          </div>
        )}

        {!checking && order && (
          <>
            <div className="checkout-success-icon">
              ✓
            </div>

            <span className="checkout-success-eyebrow">
              Pago confirmado
            </span>

            <h1>¡Gracias por tu compra!</h1>

            <p className="checkout-success-intro">
              Tu pago se ha confirmado
              correctamente y el pedido
              ha sido registrado.
            </p>

            <div className="checkout-success-order">
              <div className="checkout-success-order-row">
                <span>
                  Número de pedido
                </span>

                <strong>
                  #{order.id}
                </strong>
              </div>

              <div className="checkout-success-order-row">
                <span>Estado</span>

                <span className="checkout-success-status">
                  {order.status}
                </span>
              </div>

              <div className="checkout-success-order-row checkout-success-total">
                <span>Total</span>

                <strong>
                  {Number(
                    order.total
                  ).toFixed(2)}{" "}
                  €
                </strong>
              </div>
            </div>

            <div className="checkout-success-actions">
              <Link
                to="/products"
                className="checkout-success-primary-link"
              >
                Seguir comprando
              </Link>

              <Link
                to="/"
                className="checkout-success-secondary-link"
              >
                Volver al inicio
              </Link>
            </div>
          </>
        )}

        {!checking && error && (
          <>
            <div className="checkout-success-warning-icon">
              !
            </div>

            <span className="checkout-success-eyebrow checkout-success-eyebrow-warning">
              Comprobando pedido
            </span>

            <h1>
              El pedido aún se está
              procesando
            </h1>

            <p className="checkout-success-intro">
              {error}
            </p>

            <p className="checkout-success-help">
              Si el pago se ha completado
              en Stripe, no vuelvas a
              realizarlo. La confirmación
              puede tardar unos instantes.
            </p>

            <div className="checkout-success-actions">
              <Link
                to="/products"
                className="checkout-success-primary-link"
              >
                Volver a productos
              </Link>

              <Link
                to="/"
                className="checkout-success-secondary-link"
              >
                Ir al inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CheckoutSuccess;