import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";

import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] =
    useState({
      items: [],
      total: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [
    removingProductId,
    setRemovingProductId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const getWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/api/wishlist"
          );

        setWishlist(
          response.data?.data
            ?.wishlist ?? {
            items: [],
            total: 0,
          }
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.error ||
            "No se pudo cargar la wishlist"
        );
      } finally {
        setLoading(false);
      }
    };

    getWishlist();
  }, []);

  const handleRemove = async (
    productId
  ) => {
    try {
      setRemovingProductId(
        productId
      );

      setError("");

      await api.delete(
        `/api/wishlist/${productId}`
      );

      setWishlist((previous) => {
        const newItems =
          previous.items.filter(
            (item) =>
              item.product.id !==
              productId
          );

        return {
          items: newItems,
          total: newItems.length,
        };
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "No se pudo eliminar el producto de la wishlist"
      );
    } finally {
      setRemovingProductId(null);
    }
  };

  if (loading) {
    return (
      <section className="wishlist-page">
        <div className="wishlist-loading">
          Cargando wishlist...
        </div>
      </section>
    );
  }

  return (
    <section className="wishlist-page">
      <header className="wishlist-header">
        <div>
          <span className="wishlist-eyebrow">
            Favoritos
          </span>

          <h1>Wishlist</h1>

          <p>
            Guarda aquí los productos que
            quieras tener localizados.
          </p>
        </div>

        {wishlist.items.length > 0 && (
          <span className="wishlist-count">
            {wishlist.total}{" "}
            {wishlist.total === 1
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

      {wishlist.items.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">
            ♡
          </div>

          <h2>
            Tu wishlist está vacía
          </h2>

          <p>
            Añade tus productos favoritos
            para encontrarlos fácilmente
            más adelante.
          </p>

          <Link
            to="/products"
            className="wishlist-products-link"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.items.map(
            (item) => {
              const product =
                item.product;

              const isRemoving =
                removingProductId ===
                product.id;

              return (
                <article
                  key={product.id}
                  className="wishlist-card"
                >
                  <div className="wishlist-image-wrapper">
                    {product.imageUrl ? (
                      <img
                        src={
                          product.imageUrl
                        }
                        alt={
                          product.name
                        }
                        className="wishlist-image"
                      />
                    ) : (
                      <span className="wishlist-no-image">
                        Sin imagen
                      </span>
                    )}
                  </div>

                  <div className="wishlist-card-content">
                    {product.category && (
                      <span className="wishlist-category">
                        {
                          product.category
                        }
                      </span>
                    )}

                    <h2>
                      {product.name}
                    </h2>

                    {product.description && (
                      <p className="wishlist-description">
                        {
                          product.description
                        }
                      </p>
                    )}

                    <div className="wishlist-card-bottom">
                      <div className="wishlist-price-row">
                        <strong>
                          {Number(
                            product.price
                          ).toFixed(
                            2
                          )}{" "}
                          €
                        </strong>

                        <span
                          className={
                            product.stock <=
                            0
                              ? "wishlist-stock wishlist-stock-empty"
                              : product.stock <=
                                  5
                                ? "wishlist-stock wishlist-stock-low"
                                : "wishlist-stock"
                          }
                        >
                          {product.stock <=
                          0
                            ? "Sin stock"
                            : product.stock <=
                                5
                              ? `Quedan ${product.stock}`
                              : `${product.stock} disponibles`}
                        </span>
                      </div>

                      <div className="wishlist-actions">
                        <Link
                          to="/products"
                          className="wishlist-view-link"
                        >
                          Ver catálogo
                        </Link>

                        <button
                          type="button"
                          className="wishlist-remove-button"
                          onClick={() =>
                            handleRemove(
                              product.id
                            )
                          }
                          disabled={
                            isRemoving
                          }
                        >
                          {isRemoving
                            ? "Eliminando..."
                            : "Eliminar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}

export default Wishlist;