import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../api/api";

import "./Products.css";

function Products() {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [products, setProducts] =
    useState([]);

  const [wishlistProductIds, setWishlistProductIds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    cartLoadingProductId,
    setCartLoadingProductId,
  ] = useState(null);

  const [
    wishlistLoadingProductId,
    setWishlistLoadingProductId,
  ] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/products"
        );

        setProducts(
          response.data?.data?.products ?? []
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.error ||
            "No se pudieron cargar los productos"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlistProductIds([]);
        return;
      }

      try {
        const response = await api.get(
          "/api/wishlist"
        );

        const wishlist =
          response.data?.data?.wishlist;

        const productIds =
          wishlist?.items?.map(
            (item) => item.product.id
          ) ?? [];

        setWishlistProductIds(
          productIds
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadWishlist();
  }, [user]);

  const handleAddToCart = async (
    product
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setCartLoadingProductId(
        product.id
      );

      setError("");
      setMessage("");

      await api.post(
        "/api/cart/items",
        {
          productId: product.id,
          quantity: 1,
        }
      );

      setMessage(
        `${product.name} se ha añadido al carrito`
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "No se pudo añadir el producto al carrito"
      );
    } finally {
      setCartLoadingProductId(null);
    }
  };

  const handleWishlist = async (
    product
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isInWishlist =
      wishlistProductIds.includes(
        product.id
      );

    try {
      setWishlistLoadingProductId(
        product.id
      );

      setError("");
      setMessage("");

      if (isInWishlist) {
        await api.delete(
          `/api/wishlist/${product.id}`
        );

        setWishlistProductIds(
          (previous) =>
            previous.filter(
              (id) =>
                id !== product.id
            )
        );

        setMessage(
          `${product.name} se ha eliminado de la wishlist`
        );
      } else {
        await api.post(
          `/api/wishlist/${product.id}`
        );

        setWishlistProductIds(
          (previous) => [
            ...previous,
            product.id,
          ]
        );

        setMessage(
          `${product.name} se ha añadido a la wishlist`
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "No se pudo actualizar la wishlist"
      );
    } finally {
      setWishlistLoadingProductId(
        null
      );
    }
  };

  const getStockClass = (
    stock
  ) => {
    if (stock <= 0) {
      return "product-stock out-of-stock";
    }

    if (stock <= 5) {
      return "product-stock low-stock";
    }

    return "product-stock";
  };

  const getStockText = (
    stock
  ) => {
    if (stock <= 0) {
      return "Sin stock";
    }

    if (stock <= 5) {
      return `Solo quedan ${stock}`;
    }

    return `${stock} unidades disponibles`;
  };

  if (loading) {
    return (
      <section className="products-page">
        <p>
          Cargando productos...
        </p>
      </section>
    );
  }

  return (
    <section className="products-page">
      <header className="products-header">
        <h1>Productos</h1>

        <p>
          Descubre los productos disponibles
          y añade tus favoritos al carrito o
          a tu wishlist.
        </p>
      </header>

      {error && (
        <p className="error-message products-message">
          {error}
        </p>
      )}

      {message && (
        <p className="success-message products-message">
          {message}
        </p>
      )}

      {products.length === 0 ? (
        <div className="products-empty">
          <p>
            No hay productos disponibles
            actualmente.
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(
            (product) => {
              const isInWishlist =
                wishlistProductIds.includes(
                  product.id
                );

              const addingToCart =
                cartLoadingProductId ===
                product.id;

              const updatingWishlist =
                wishlistLoadingProductId ===
                product.id;

              return (
                <article
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-image-container">
                    {product.imageUrl ? (
                      <img
                        src={
                          product.imageUrl
                        }
                        alt={
                          product.name
                        }
                        className="product-image"
                      />
                    ) : (
                      <span className="product-image-placeholder">
                        Sin imagen
                      </span>
                    )}
                  </div>

                  <div className="product-content">
                    {product.category && (
                      <span className="product-category">
                        {
                          product.category
                        }
                      </span>
                    )}

                    <h2 className="product-name">
                      {product.name}
                    </h2>

                    <p className="product-description">
                      {
                        product.description
                      }
                    </p>
                    <div className="product-info">
                      <p className="product-price">
                        {Number(
                          product.price
                        ).toFixed(2)}{" "}
                        €
                      </p>

                      <p
                        className={getStockClass(
                          product.stock
                        )}
                      >
                        {getStockText(
                          product.stock
                        )}
                      </p>

                      <div className="product-actions">
                        <button
                          type="button"
                          className="button-primary"
                          onClick={() =>
                            handleAddToCart(
                              product
                            )
                          }
                          disabled={
                            product.stock <=
                              0 ||
                            addingToCart
                          }
                        >
                          {addingToCart
                            ? "Añadiendo..."
                            : product.stock <=
                                0
                              ? "Sin stock"
                              : "Añadir al carrito"}
                        </button>
                        <button
                          type="button"
                          className={
                            isInWishlist
                              ? "button-secondary product-wishlist-active"
                              : "button-secondary"
                          }
                          onClick={() =>
                            handleWishlist(
                              product
                            )
                          }
                          disabled={
                            updatingWishlist
                          }
                        >
                          {updatingWishlist
                            ? "Guardando..."
                            : isInWishlist
                              ? "♥ En wishlist"
                              : "♡ Wishlist"}
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

export default Products;