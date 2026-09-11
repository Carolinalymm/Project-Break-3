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

  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Inicio</NavLink>
          {" | "}

          <NavLink to="/products">
            Productos
          </NavLink>
          {" | "}

          <NavLink to="/wishlist">
            Wishlist
          </NavLink>
          {" | "}

          <NavLink to="/cart">
            Carrito
          </NavLink>
          {" | "}

          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/admin">
                Admin
              </NavLink>
              {" | "}
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login">
                Login
              </NavLink>
              {" | "}

              <NavLink to="/register">
                Registro
              </NavLink>
            </>
          )}

          {user && (
            <>
              <span>
                Hola, {user.name}
              </span>{" "}

              <button
                type="button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;