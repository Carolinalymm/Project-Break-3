import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Inicio</NavLink>{" | "}
          <NavLink to="/products">Productos</NavLink>{" | "}
          <NavLink to="/wishlist">Wishlist</NavLink>{" | "}
          <NavLink to="/cart">Carrito</NavLink>{" | "}
          <NavLink to="/login">Login</NavLink>{" | "}
          <NavLink to="/register">Registro</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;