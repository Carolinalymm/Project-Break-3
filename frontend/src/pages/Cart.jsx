import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";

import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(true);

  const [actionItemId, setActionItemId] =
    useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const getCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/cart"
        );

        setCart(
          response.data.data.cart
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

  const updateQuantity = async (
    itemId,
    quantity
  ) => {
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

      setCart(
        response.data.data.cart
      );
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

  const removeItem = async (
    itemId
  ) => {
    try {
      setActionItemId(itemId);
      setError("");

      const response = await api.delete(
        `/api/cart/items/${itemId}`
      );

      setCart(
        response.data.data.cart
      );
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
    return (
      <section className="cart-page">
        <div className="cart-loading">
          Cargando carrito...
        </div>
      </section>
    );
  }

  if (!cart) {
    return (
      <section className="cart-page">
        <h1>Carrito</h1>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="cart-page">
      <header className="cart-header">
        <div>
          <span className="cart-eyebrow">
            Tu compra
          </span>

          <h1>Carrito</h1>

          <p>
            Revisa los productos antes de
            continuar con el pago.
          </p>
        </div>

        {cart.items.length > 0 && (
          <span className="cart-header-count">
            {cart.totalItems}{" "}
            {cart.totalItems === 1
              ? "producto"
              : "productos"}
          </span>
        )}
      </header>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {cart.items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">
            🛒
          </div>

          <h2>Tu carrito está vacío</h2>

          <p>
            Explora nuestro catálogo y
            añade algún producto para
            continuar.
          </p>

          <Link
            to="/products"
            className="cart-products-link"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => {
              const isUpdating =
                actionItemId ===
                item.id;

              return (
                <article
                  key={item.id}
                  className="cart-item"
                >
                  <div className="cart-item-image-wrapper">
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
                        className="cart-item-image"
                      />
                    ) : (
                      <span className="cart-item-no-image">
                        Sin imagen
                      </span>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-heading">
                      <div>
                        {item.product
                          ?.category && (
                          <span className="cart-item-category">
                            {
                              item
                                .product
                                .category
                            }
                          </span>
                        )}

                        <h2>
                          {
                            item
                              .product
                              ?.name
                          }
                        </h2>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() =>
                          removeItem(
                            item.id
                          )
                        }
                        disabled={
                          isUpdating
                        }
                      >
                        {isUpdating
                          ? "Procesando..."
                          : "Eliminar"}
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-unit-price">
                        <span>
                          Precio unitario
                        </span>

                        <strong>
                          {Number(
                            item.unitPrice
                          ).toFixed(
                            2
                          )}{" "}
                          €
                        </strong>
                      </div>

                      <div className="cart-quantity">
                        <span className="cart-quantity-label">
                          Cantidad
                        </span>

                        <div className="cart-quantity-controls">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity -
                                  1
                              )
                            }
                            disabled={
                              item.quantity <=
                                1 ||
                              isUpdating
                            }
                            aria-label="Reducir cantidad"
                          >
                            −
                          </button>

                          <span>
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity +
                                  1
                              )
                            }
                            disabled={
                              isUpdating
                            }
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-subtotal">
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          {Number(
                            item.subtotal
                          ).toFixed(
                            2
                          )}{" "}
                          €
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="cart-summary">
            <span className="cart-summary-kicker">
              Resumen
            </span>

            <h2>Tu pedido</h2>

            <div className="cart-summary-row">
              <span>
                Productos
              </span>

              <strong>
                {cart.totalItems}
              </strong>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Total</span>

              <strong>
                {Number(
                  cart.total
                ).toFixed(2)}{" "}
                €
              </strong>
            </div>

            <p className="cart-summary-note">
              El pago se realizará de forma
              segura mediante Stripe.
            </p>

            <Link
              to="/checkout"
              className="cart-checkout-link"
            >
              Ir al checkout
            </Link>

            <Link
              to="/products"
              className="cart-continue-link"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;