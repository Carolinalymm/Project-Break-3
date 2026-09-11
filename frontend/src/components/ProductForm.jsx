import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  imageUrl: "",
};

function ProductForm({
  initialValues = EMPTY_FORM,
  onSubmit,
  submitLabel = "Guardar producto",
  loading = false,
  serverError = "",
}) {
  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    ...initialValues,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      ...EMPTY_FORM,
      ...initialValues,
    });

    setErrors({});
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name =
        "El nombre debe tener al menos 2 caracteres";
    }

    if (formData.description.trim().length < 5) {
      newErrors.description =
        "La descripción debe tener al menos 5 caracteres";
    }

    if (formData.category.trim().length < 2) {
      newErrors.category =
        "La categoría debe tener al menos 2 caracteres";
    }

    if (
      formData.price === "" ||
      Number.isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      newErrors.price =
        "El precio debe ser un número igual o superior a 0";
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock =
        "El stock debe ser un número entero igual o superior a 0";
    }

    if (formData.imageUrl.trim()) {
      try {
        const url = new URL(
          formData.imageUrl.trim()
        );

        if (
          url.protocol !== "http:" &&
          url.protocol !== "https:"
        ) {
          newErrors.imageUrl =
            "La imagen debe tener una URL válida";
        }
      } catch {
        newErrors.imageUrl =
          "La imagen debe tener una URL válida";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      imageUrl: formData.imageUrl.trim(),
    };

    await onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">
          Nombre
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />

        {errors.name && (
          <p>{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description">
          Descripción
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {errors.description && (
          <p>{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category">
          Categoría
        </label>

        <input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
        />

        {errors.category && (
          <p>{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="price">
          Precio
        </label>

        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
        />

        {errors.price && (
          <p>{errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="stock">
          Stock
        </label>

        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={formData.stock}
          onChange={handleChange}
        />

        {errors.stock && (
          <p>{errors.stock}</p>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl">
          URL de imagen
        </label>

        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://..."
        />

        {errors.imageUrl && (
          <p>{errors.imageUrl}</p>
        )}
      </div>

      {serverError && (
        <p>{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Guardando..."
          : submitLabel}
      </button>
    </form>
  );
}

export default ProductForm;