import { useEffect, useState } from "react";

import api from "../api/api";
import ProductForm from "../components/ProductForm";

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  imageUrl: "",
};

function Admin() {
  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [creatingProduct, setCreatingProduct] =
    useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  const [formKey, setFormKey] = useState(0);

  const getProducts = async () => {
    try {
      setLoadingProducts(true);
      setError("");

      const response = await api.get(
        "/api/products"
      );

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
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleCreateProduct = async (
    productData
  ) => {
    try {
      setCreatingProduct(true);
      setFormError("");
      setMessage("");

      const response = await api.post(
        "/api/products",
        productData
      );

      const newProduct =
        response.data.data.product;

      setProducts((previous) => [
        newProduct,
        ...previous,
      ]);

      setMessage(
        `${newProduct.name} se ha creado correctamente`
      );

      setFormKey((previous) => previous + 1);
    } catch (error) {
      console.error(error);

      setFormError(
        error.response?.data?.error ||
          "No se pudo crear el producto"
      );
    } finally {
      setCreatingProduct(false);
    }
  };

  return (
    <section>
      <h1>
        Panel de administración
      </h1>

      <p>
        Gestiona los productos disponibles
        en la tienda.
      </p>

      <section>
        <h2>Crear producto</h2>

        {message && <p>{message}</p>}

        <ProductForm
          key={formKey}
          initialValues={EMPTY_PRODUCT}
          onSubmit={handleCreateProduct}
          submitLabel="Crear producto"
          loading={creatingProduct}
          serverError={formError}
        />
      </section>

      <hr />

      <section>
        <h2>Productos</h2>

        {error && <p>{error}</p>}

        {loadingProducts ? (
          <p>Cargando productos...</p>
        ) : (
          <>
            <p>
              Productos encontrados:{" "}
              {products.length}
            </p>

            {products.length === 0 ? (
              <p>
                No hay productos disponibles.
              </p>
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

                  <p>
                    {product.description}
                  </p>

                  <p>
                    Precio:{" "}
                    {product.price.toFixed(2)} €
                  </p>

                  <p>
                    Stock: {product.stock}
                  </p>

                  <p>
                    Categoría:{" "}
                    {product.category}
                  </p>

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
          </>
        )}
      </section>
    </section>
  );
}

export default Admin;