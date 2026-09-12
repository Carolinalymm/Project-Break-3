import { useEffect, useState } from "react";

import api from "../api/api";
import ProductForm from "../components/ProductForm";

import "./Admin.css";

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
  const [deleteError, setDeleteError] =
    useState("");
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">
            Administración
          </span>

          <h1>Panel de administración</h1>

          <p>
            Crea, modifica y elimina los productos
            disponibles en la tienda.
          </p>
        </div>

        <div className="admin-summary">
          <span className="admin-summary-number">
            {products.length}
          </span>

          <span className="admin-summary-label">
            Productos
          </span>
        </div>
      </header>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {deleteError && (
        <p className="error-message">
          {deleteError}
        </p>
      )}

      <div
        className={
          editingProduct
            ? "admin-form-layout admin-form-layout-editing"
            : "admin-form-layout"
        }
      >
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span className="admin-panel-kicker">
                Nuevo
              </span>

              <h2>Crear producto</h2>
            </div>
          </div>

          <ProductForm
            key={formKey}
            initialValues={EMPTY_PRODUCT}
            onSubmit={handleCreateProduct}
            submitLabel="Crear producto"
            loading={creatingProduct}
            serverError={formError}
          />
        </section>

        {editingProduct && (
          <section className="admin-panel admin-edit-panel">
            <div className="admin-panel-header">
              <div>
                <span className="admin-panel-kicker">
                  Edición
                </span>

                <h2>Editar producto</h2>

                <p>
                  Estás editando{" "}
                  <strong>
                    {editingProduct.name}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="button-secondary admin-cancel-button"
                onClick={handleCancelEdit}
                disabled={updatingProduct}
              >
                Cancelar
              </button>
            </div>

            <ProductForm
              initialValues={editingProduct}
              onSubmit={handleUpdateProduct}
              submitLabel="Guardar cambios"
              loading={updatingProduct}
              serverError={editError}
            />
          </section>
        )}
      </div>

      <section className="admin-products-section">
        <div className="admin-products-heading">
          <div>
            <span className="admin-panel-kicker">
              Catálogo
            </span>

            <h2>Productos</h2>

            <p>
              Gestiona el catálogo actual de la
              tienda.
            </p>
          </div>

          <span className="admin-products-count">
            {products.length}{" "}
            {products.length === 1
              ? "producto"
              : "productos"}
          </span>
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {loadingProducts ? (
          <div className="admin-loading">
            Cargando productos...
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <h3>No hay productos</h3>

            <p>
              Crea el primer producto utilizando
              el formulario superior.
            </p>
          </div>
        ) : (
          <div className="admin-products-table">
            <div className="admin-products-table-header">
              <span>Producto</span>
              <span>Categoría</span>
              <span>Precio</span>
              <span>Stock</span>
              <span>Acciones</span>
            </div>

            <div className="admin-products-list">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={
                    editingProduct?.id ===
                    product.id
                      ? "admin-product-row admin-product-row-editing"
                      : "admin-product-row"
                  }
                >
                  <div className="admin-product-main">
                    <div className="admin-product-image-wrapper">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="admin-product-image"
                        />
                      ) : (
                        <span className="admin-product-no-image">
                          Sin imagen
                        </span>
                      )}
                    </div>

                    <div className="admin-product-info">
                      <h3>{product.name}</h3>

                      <p>
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className="admin-product-cell"
                    data-label="Categoría"
                  >
                    <span className="admin-category">
                      {product.category}
                    </span>
                  </div>

                  <div
                    className="admin-product-cell admin-product-price"
                    data-label="Precio"
                  >
                    {Number(
                      product.price
                    ).toFixed(2)}{" "}
                    €
                  </div>

                  <div
                    className="admin-product-cell"
                    data-label="Stock"
                  >
                    <span
                      className={
                        product.stock <= 0
                          ? "admin-stock admin-stock-empty"
                          : product.stock <= 5
                            ? "admin-stock admin-stock-low"
                            : "admin-stock"
                      }
                    >
                      {product.stock}
                    </span>
                  </div>

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      className="button-secondary"
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

                    <button
                      type="button"
                      className="button-danger"
                      onClick={() =>
                        handleDeleteProduct(
                          product
                        )
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

export default Admin;