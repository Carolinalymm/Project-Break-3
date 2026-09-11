import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";

function Wishlist() {
  const [wishlist, setWishlist] = useState({
    items: [],
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [removingProductId, setRemovingProductId] =
    useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/wishlist");

        setWishlist(
          response.data?.data?.wishlist ?? {
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

  const handleRemove = async (productId) => {
    try {
      setRemovingProductId(productId);
      setError("");

      await api.delete(`/api/wishlist/${productId}`);

      setWishlist((previous) => {
        const newItems = previous.items.filter(
          (item) => item.product.id !== productId
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
    return <p>Cargando wishlist...</p>;
  }

  return (
    <section>
      <h1>Wishlist</h1>

      {error && <p>{error}</p>}

      {wishlist.items.length === 0 ? (
        <>
          <p>Tu wishlist está vacía.</p>
          <Link to="/products">Ver productos</Link>
        </>
      ) : (
        <>
          <p>
            Productos guardados: {wishlist.total}
          </p>

          {wishlist.items.map((item) => {
            const product = item.product;

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

                <p>
                  Precio: {product.price.toFixed(2)} €
                </p>

                <p>Stock: {product.stock}</p>

                <button
                  type="button"
                  onClick={() =>
                    handleRemove(product.id)
                  }
                  disabled={
                    removingProductId === product.id
                  }
                >
                  {removingProductId === product.id
                    ? "Eliminando..."
                    : "Eliminar de wishlist"}
                </button>
              </article>
            );
          })}
        </>
      )}
    </section>
  );
}

export default Wishlist;