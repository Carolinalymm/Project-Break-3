import { useEffect, useState } from "react";
import api from "../api/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await api.get("/api/products");

        const productsData = response.data?.data?.products ?? [];

        setProducts(productsData);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los productos");
      }
    };

    getProducts();
  }, []);

  return (
    <>
      <h1>Productos</h1>

      {error && <p>{error}</p>}

      <p>Productos encontrados: {products.length}</p>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price} €</p>
        </div>
      ))}
    </>
  );
}

export default Products;