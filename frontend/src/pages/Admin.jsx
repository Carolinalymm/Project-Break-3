import { useEffect, useState } from "react";

import api from "../api/api";

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <section>
      <h1>Panel de administración</h1>

      <p>
        Gestiona los productos disponibles en la tienda.
      </p>

      {error && <p>{error}</p>}

      <h2>Productos</h2>

      <p>
        Productos encontrados: {products.length}
      </p>

      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        products.map((product) => (
          <article key={product.id}>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                width="120"
              />
            )}

            <h3>{product.name}</h3>

            {product.description && (
              <p>{product.description}</p>
            )}

            <p>
              Precio: {product.price.toFixed(2)} €
            </p>

            <p>Stock: {product.stock}</p>

            {product.category && (
              <p>
                Categoría: {product.category}
              </p>
            )}

            <button
              type="button"
              disabled
            >
              Editar
            </button>

            {" "}

            <button
              type="button"
              disabled
            >
              Eliminar
            </button>
          </article>
        ))
      )}
    </section>
  );
}

export default Admin;