import {
  useEffect,
  useRef,
  useState,
} from "react";

import api from "../api/api";

import "./ProductForm.css";

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

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

function ProductForm({
  initialValues = EMPTY_FORM,
  onSubmit,
  submitLabel = "Guardar producto",
  loading = false,
  serverError = "",
}) {
  const [formData, setFormData] =
    useState({
      ...EMPTY_FORM,
      ...initialValues,
    });

  const [errors, setErrors] =
    useState({});

  const [imageFile, setImageFile] =
    useState(null);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [uploadError, setUploadError] =
    useState("");

  const fileInputRef =
    useRef(null);

  useEffect(() => {
    setFormData({
      ...EMPTY_FORM,
      ...initialValues,
    });

    setErrors({});
    setImageFile(null);
    setUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};

    if (
      formData.name.trim().length <
      2
    ) {
      newErrors.name =
        "El nombre debe tener al menos 2 caracteres";
    }

    if (
      formData.description.trim()
        .length < 5
    ) {
      newErrors.description =
        "La descripción debe tener al menos 5 caracteres";
    }

    if (
      formData.category.trim()
        .length < 2
    ) {
      newErrors.category =
        "La categoría debe tener al menos 2 caracteres";
    }

    if (
      formData.price === "" ||
      Number.isNaN(
        Number(formData.price)
      ) ||
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
      Object.keys(newErrors).length ===
      0
    );
  };

  const validateImage = (
    file
  ) => {
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      setUploadError(
        "Solo se permiten imágenes JPEG, PNG o WebP"
      );

      return false;
    }

    if (
      file.size > MAX_IMAGE_SIZE
    ) {
      setUploadError(
        "La imagen no puede superar los 5 MB"
      );

      return false;
    }

    setUploadError("");

    return true;
  };

  const handleChange = (
    event
  ) => {
    const { name, value } =
      event.target;

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

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

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

    const imageData =
      new FormData();

    imageData.append(
      "image",
      imageFile
    );

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

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setUploadError("");

    if (!validateForm()) {
      return;
    }

    let imageUrl =
      formData.imageUrl;

    if (imageFile) {
      try {
        setUploadingImage(true);

        imageUrl =
          await uploadImage();

        setFormData(
          (previous) => ({
            ...previous,
            imageUrl,
          })
        );

        setImageFile(null);

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            "";
        }
      } catch (error) {
        console.error(error);

        setUploadError(
          error.response?.data
            ?.error ||
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
      category:
        formData.category.trim(),
      price: Number(
        formData.price
      ),
      stock: Number(
        formData.stock
      ),
      imageUrl,
    };

    await onSubmit(productData);
  };

  const isSubmitting =
    loading || uploadingImage;

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      <div className="product-form-grid">
        <div className="product-form-field product-form-field-wide">
          <label htmlFor="name">
            Nombre
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
          />

          {errors.name && (
            <p className="product-form-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="product-form-field product-form-field-wide">
          <label htmlFor="description">
            Descripción
          </label>

          <textarea
            id="description"
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            placeholder="Describe brevemente el producto"
          />

          {errors.description && (
            <p className="product-form-error">
              {errors.description}
            </p>
          )}
        </div>

        <div className="product-form-field product-form-field-wide">
          <label htmlFor="category">
            Categoría
          </label>

          <input
            id="category"
            name="category"
            type="text"
            value={
              formData.category
            }
            onChange={handleChange}
            placeholder="Ej. Tecnología"
          />

          {errors.category && (
            <p className="product-form-error">
              {errors.category}
            </p>
          )}
        </div>

        <div className="product-form-field">
          <label htmlFor="price">
            Precio
          </label>

          <div className="product-form-input-unit">
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={
                formData.price
              }
              onChange={handleChange}
              placeholder="0.00"
            />

            <span>€</span>
          </div>

          {errors.price && (
            <p className="product-form-error">
              {errors.price}
            </p>
          )}
        </div>

        <div className="product-form-field">
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
            placeholder="0"
          />

          {errors.stock && (
            <p className="product-form-error">
              {errors.stock}
            </p>
          )}
        </div>
      </div>

      <div className="product-form-image-section">
        <div className="product-form-image-upload">
          <label htmlFor="image">
            Imagen del producto
          </label>

          <input
            ref={fileInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              handleImageChange
            }
          />

          <p className="product-form-help">
            JPEG, PNG o WebP. Máximo
            5 MB.
          </p>

          {imageFile && (
            <p className="product-form-file-selected">
              Imagen seleccionada:{" "}
              <strong>
                {imageFile.name}
              </strong>
            </p>
          )}

          {uploadError && (
            <p className="product-form-error">
              {uploadError}
            </p>
          )}
        </div>

        <div className="product-form-preview">
          <span className="product-form-preview-label">
            Vista previa
          </span>

          {formData.imageUrl ? (
            <img
              src={
                formData.imageUrl
              }
              alt="Vista previa del producto"
              className="product-form-preview-image"
            />
          ) : (
            <div className="product-form-preview-empty">
              Sin imagen
            </div>
          )}
        </div>
      </div>

      {serverError && (
        <p className="error-message">
          {serverError}
        </p>
      )}

      <div className="product-form-actions">
        <button
          type="submit"
          className="button-primary"
          disabled={isSubmitting}
        >
          {uploadingImage
            ? "Subiendo imagen..."
            : loading
              ? "Guardando..."
              : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;