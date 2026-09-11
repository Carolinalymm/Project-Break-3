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

  const [updatingProduct, setUpdatingProduct] =
    useState(false);

  const [deletingProductId, setDeletingProductId] =
    useState(null);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");
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

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setEditError("");
    setDeleteError("");
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditError("");
  };

  const handleUpdateProduct = async (
    productData
  ) => {
    if (!editingProduct) {
      return;
    }

    try {
      setUpdatingProduct(true);
      setEditError("");
      setMessage("");

      const response = await api.put(
        `/api/products/${editingProduct.id}`,
        productData
      );

      const updatedProduct =
        response.data.data.product;

      setProducts((previous) =>
        previous.map((product) =>
          product.id === updatedProduct.id
            ? updatedProduct
            : product
        )
      );

      setMessage(
        `${updatedProduct.name} se ha actualizado correctamente`
      );

      setEditingProduct(null);
    } catch (error) {
      console.error(error);

      setEditError(
        error.response?.data?.error ||
          "No se pudo actualizar el producto"
      );
    } finally {
      setUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(product.id);
      setDeleteError("");
      setMessage("");

      await api.delete(
        `/api/products/${product.id}`
      );

      setProducts((previous) =>
        previous.filter(
          (currentProduct) =>
            currentProduct.id !== product.id
        )
      );

      if (
        editingProduct?.id === product.id
      ) {
        setEditingProduct(null);
      }

      setMessage(
        `${product.name} se ha eliminado correctamente`
      );
    } catch (error) {
      console.error(error);

      setDeleteError(
        error.response?.data?.error ||
          "No se pudo eliminar el producto"
      );
    } finally {
      setDeletingProductId(null);
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

      {message && <p>{message}</p>}

      {deleteError && (
        <p>{deleteError}</p>
      )}

      <section>
        <h2>Crear producto</h2>

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

      {editingProduct && (
        <>
          <section>
            <h2>
              Editar producto
            </h2>

            <p>
              Editando:{" "}
              <strong>
                {editingProduct.name}
              </strong>
            </p>

            <ProductForm
              initialValues={editingProduct}
              onSubmit={handleUpdateProduct}
              submitLabel="Guardar cambios"
              loading={updatingProduct}
              serverError={editError}
            />

            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={updatingProduct}
            >
              Cancelar edición
            </button>
          </section>

          <hr />
        </>
      )}

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
                    onClick={() =>
                      handleStartEdit(product)
                    }
                    disabled={
                      deletingProductId ===
                      product.id
                    }
                  >
                    Editar
                  </button>

                  {" "}

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteProduct(product)
                    }
                    disabled={
                      deletingProductId ===
                      product.id
                    }
                  >
                    {deletingProductId ===
                    product.id
                      ? "Eliminando..."
                      : "Eliminar"}
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