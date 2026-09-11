import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

function Products() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [wishlistProductIds, setWishlistProductIds] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] =
    useState(null);
  const [wishlistActionId, setWishlistActionId] =
    useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/products");

        const productsData =
          response.data?.data?.products ?? [];

        setProducts(productsData);
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

    getProducts();
  }, []);

  useEffect(() => {
    const getWishlist = async () => {
      if (!user) {
        setWishlistProductIds([]);
        return;
      }

      try {
        const response = await api.get("/api/wishlist");

        const items =
          response.data?.data?.wishlist?.items ?? [];

        const productIds = items.map(
          (item) => item.product.id
        );

        setWishlistProductIds(productIds);
      } catch (error) {
        console.error(error);
      }
    };

    getWishlist();
  }, [user]);

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setAddingProductId(product.id);
      setError("");
      setMessage("");

      await api.post("/api/cart/items", {
        productId: product.id,
        quantity: 1,
      });

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
      setAddingProductId(null);
    }
  };

  const handleToggleWishlist = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isInWishlist =
      wishlistProductIds.includes(product.id);

    try {
      setWishlistActionId(product.id);
      setError("");
      setMessage("");

      if (isInWishlist) {
        await api.delete(
          `/api/wishlist/${product.id}`
        );

        setWishlistProductIds((previous) =>
          previous.filter(
            (productId) =>
              productId !== product.id
          )
        );

        setMessage(
          `${product.name} se ha eliminado de la wishlist`
        );
      } else {
        await api.post(
          `/api/wishlist/${product.id}`
        );

        setWishlistProductIds((previous) => [
          ...previous,
          product.id,
        ]);

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
      setWishlistActionId(null);
    }
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <section>
      <h1>Productos</h1>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      <p>
        Productos encontrados: {products.length}
      </p>

      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        products.map((product) => {
          const isInWishlist =
            wishlistProductIds.includes(product.id);

          return (
            <article key={product.id}>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width="200"
                />
              )}

              <h2>{product.name}</h2>

              {product.description && (
                <p>{product.description}</p>
              )}

              {product.category && (
                <p>
                  Categoría: {product.category}
                </p>
              )}

              <p>
                Precio: {product.price.toFixed(2)} €
              </p>

              <p>Stock: {product.stock}</p>

              <button
                type="button"
                onClick={() =>
                  handleAddToCart(product)
                }
                disabled={
                  product.stock <= 0 ||
                  addingProductId === product.id
                }
              >
                {product.stock <= 0
                  ? "Sin stock"
                  : addingProductId === product.id
                    ? "Añadiendo..."
                    : "Añadir al carrito"}
              </button>

              {" "}

              <button
                type="button"
                onClick={() =>
                  handleToggleWishlist(product)
                }
                disabled={
                  wishlistActionId === product.id
                }
              >
                {wishlistActionId === product.id
                  ? "Actualizando..."
                  : isInWishlist
                    ? "Quitar de wishlist"
                    : "Añadir a wishlist"}
              </button>
            </article>
          );
        })
      )}
    </section>
  );
}

export default Products;