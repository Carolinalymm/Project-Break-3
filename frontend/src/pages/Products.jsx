import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

function Products() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
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

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <section>
      <h1>Productos</h1>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      <p>Productos encontrados: {products.length}</p>

      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        products.map((product) => (
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
              <p>Categoría: {product.category}</p>
            )}

            <p>Precio: {product.price.toFixed(2)} €</p>

            <p>Stock: {product.stock}</p>

            <button
              type="button"
              onClick={() => handleAddToCart(product)}
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
          </article>
        ))
      )}
    </section>
  );
}

export default Products;