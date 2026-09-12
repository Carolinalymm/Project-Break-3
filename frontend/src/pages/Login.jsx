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
  loginUser,
  clearAuthError,
} from "../features/auth/authSlice";

import "./Auth.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } =
    useSelector(
      (state) => state.auth
    );

  const [formData, setFormData] =
    useState({
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
        loginUser(formData)
      );

    if (
      loginUser.fulfilled.match(
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
            Bienvenida
          </span>

          <h1>Iniciar sesión</h1>

          <p>
            Accede a tu cuenta para
            gestionar tu carrito,
            wishlist y pedidos.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
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
              placeholder="Tu contraseña"
              autoComplete="current-password"
              required
            />
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
              ? "Entrando..."
              : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-footer">
          <span>
            ¿Todavía no tienes
            cuenta?
          </span>

          <Link to="/register">
            Crear cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Login;