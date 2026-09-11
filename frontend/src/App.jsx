import { useEffect, useState } from "react";
import api from "./api/api";

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await api.get("/api/products");

        console.log("Respuesta productos:", response.data);

        setProducts(response.data.data.products);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los productos");
      }
    };

    getProducts();
  }, []);

  return (
    <main>
      <h1>Project Break 3</h1>

      {error && <p>{error}</p>}

      <p>Productos encontrados: {products.length}</p>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price} €</p>
        </div>
      ))}
    </main>
  );
}

export default App;