import { useEffect } from "react";
import {
  NavLink,
  Outlet,
} from "react-router-dom";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getCurrentUser,
  logoutUser,
} from "../features/auth/authSlice";

function Layout() {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const getNavLinkClass = ({
    isActive,
  }) =>
    `navbar-link${
      isActive ? " active" : ""
    }`;

  return (
    <>
      <header className="app-header">
        <nav className="navbar">
          <NavLink
            to="/"
            className="navbar-brand"
          >
            Project Break
          </NavLink>

          <div className="navbar-links">
            <NavLink
              to="/"
              end
              className={getNavLinkClass}
            >
              Inicio
            </NavLink>

            <NavLink
              to="/products"
              className={getNavLinkClass}
            >
              Productos
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/wishlist"
                  className={getNavLinkClass}
                >
                  Wishlist
                </NavLink>

                <NavLink
                  to="/cart"
                  className={getNavLinkClass}
                >
                  Carrito
                </NavLink>
              </>
            )}

            {user?.role === "ADMIN" && (
              <NavLink
                to="/admin"
                className={getNavLinkClass}
              >
                Administración
              </NavLink>
            )}
          </div>

          <div className="navbar-user">
            {!user && (
              <>
                <NavLink
                  to="/login"
                  className={getNavLinkClass}
                >
                  Iniciar sesión
                </NavLink>

                <NavLink
                  to="/register"
                  className={getNavLinkClass}
                >
                  Registro
                </NavLink>
              </>
            )}

            {user && (
              <>
                <span className="navbar-user-name">
                  Hola, {user.name}
                </span>

                <button
                  type="button"
                  className="button-secondary"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;