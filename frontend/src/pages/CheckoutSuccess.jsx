import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import api from "../api/api";

function CheckoutSuccess() {
  const [searchParams] = useSearchParams();

  const sessionId =
    searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const checkOrder = async () => {
      try {
        setChecking(true);
        setError("");

        /*
         * El webhook de Stripe puede tardar
         * uno o dos segundos en procesarse.
         * Por eso comprobamos los pedidos
         * varias veces.
         */
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const response = await api.get(
            "/api/orders"
          );

          const orders =
            response.data?.data?.orders ?? [];

          const latestOrder =
            orders[0] ?? null;

          if (
            latestOrder &&
            latestOrder.status === "PAID"
          ) {
            if (!cancelled) {
              setOrder(latestOrder);
            }

            return;
          }

          await new Promise((resolve) =>
            setTimeout(resolve, 1500)
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
            error.response?.data?.error ||
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
    <section>
      <h1>Pago realizado</h1>

      {checking && (
        <p>
          Confirmando el pago con Stripe...
        </p>
      )}

      {order && (
        <>
          <p>
            Tu pago se ha confirmado correctamente.
          </p>

          <p>
            Pedido: #{order.id}
          </p>

          <p>
            Estado: {order.status}
          </p>

          <p>
            Total:{" "}
            {Number(order.total).toFixed(2)} €
          </p>

          <Link to="/products">
            Seguir comprando
          </Link>
        </>
      )}

      {error && (
        <>
          <p>{error}</p>

          <Link to="/products">
            Volver a productos
          </Link>
        </>
      )}
    </section>
  );
}

export default CheckoutSuccess;