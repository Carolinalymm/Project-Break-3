import { useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  registerUser,
  clearAuthError,
} from "../features/auth/authSlice";

import "./Auth.css";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } =
    useSelector(
      (state) => state.auth
    );

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const result =
      await dispatch(
        registerUser(formData)
      );

    if (
      registerUser.fulfilled.match(
        result
      )
    ) {
      navigate("/");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="auth-eyebrow">
            Registro
          </span>

          <h1>Crear cuenta</h1>

          <p>
            Regístrate para guardar
            productos, gestionar tu
            carrito y completar pedidos.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-field">
            <label htmlFor="name">
              Nombre
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              required
              minLength="8"
            />

            <p className="auth-help">
              Debe tener al menos 8
              caracteres.
            </p>
          </div>

          {error && (
            <p className="error-message auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button-primary auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creando cuenta..."
              : "Registrarse"}
          </button>
        </form>

        <div className="auth-footer">
          <span>
            ¿Ya tienes una cuenta?
          </span>

          <Link to="/login">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Register;