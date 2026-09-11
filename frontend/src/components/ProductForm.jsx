import { useEffect, useRef, useState } from "react";

import api from "../api/api";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  imageUrl: "",
};

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] =
    useState(false);
  const [uploadError, setUploadError] =
    useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      ...EMPTY_FORM,
      ...initialValues,
    });

    setErrors({});
    setImageFile(null);
    setUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name =
        "El nombre debe tener al menos 2 caracteres";
    }

    if (
      formData.description.trim().length < 5
    ) {
      newErrors.description =
        "La descripción debe tener al menos 5 caracteres";
    }

    if (
      formData.category.trim().length < 2
    ) {
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
      !Number.isInteger(
        Number(formData.stock)
      ) ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock =
        "El stock debe ser un número entero igual o superior a 0";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const validateImage = (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError(
        "Solo se permiten imágenes JPEG, PNG o WebP"
      );

      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError(
        "La imagen no puede superar los 5 MB"
      );

      return false;
    }

    setUploadError("");

    return true;
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!validateImage(file)) {
      setImageFile(null);

      event.target.value = "";

      return;
    }

    setImageFile(file);
  };

  const uploadImage = async () => {
    if (!imageFile) {
      return formData.imageUrl;
    }

    const imageData = new FormData();

    imageData.append("image", imageFile);

    const response = await api.post(
      "/api/uploads/products",
      imageData
    );

    const uploadedImage =
      response.data?.data?.image;

    if (!uploadedImage?.url) {
      throw new Error(
        "El servidor no devolvió la URL de la imagen"
      );
    }

    return uploadedImage.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUploadError("");

    if (!validateForm()) {
      return;
    }

    let imageUrl = formData.imageUrl;

    if (imageFile) {
      try {
        setUploadingImage(true);

        imageUrl = await uploadImage();

        setFormData((previous) => ({
          ...previous,
          imageUrl,
        }));

        setImageFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error(error);

        setUploadError(
          error.response?.data?.error ||
            error.message ||
            "No se pudo subir la imagen"
        );

        return;
      } finally {
        setUploadingImage(false);
      }
    }

    const productData = {
      name: formData.name.trim(),
      description:
        formData.description.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      imageUrl,
    };

    await onSubmit(productData);
  };

  const isSubmitting =
    loading || uploadingImage;

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
        <label htmlFor="image">
          Imagen del producto
        </label>

        <input
          ref={fileInputRef}
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
        />

        <p>
          JPEG, PNG o WebP. Máximo 5 MB.
        </p>

        {imageFile && (
          <p>
            Imagen seleccionada:{" "}
            {imageFile.name}
          </p>
        )}

        {uploadError && (
          <p>{uploadError}</p>
        )}
      </div>

      {formData.imageUrl && (
        <div>
          <p>Imagen actual:</p>

          <img
            src={formData.imageUrl}
            alt="Vista previa del producto"
            width="150"
          />
        </div>
      )}

      {serverError && (
        <p>{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {uploadingImage
          ? "Subiendo imagen..."
          : loading
            ? "Guardando..."
            : submitLabel}
      </button>
    </form>
  );
}

export default ProductForm;