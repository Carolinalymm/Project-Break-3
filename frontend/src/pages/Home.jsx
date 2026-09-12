import { Link } from "react-router-dom";

import "./Home.css";

function Home() {
  return (
    <section className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">
            Project Break 3
          </span>

          <h1>
            Encuentra lo que buscas.
            <span> Compra de forma sencilla.</span>
          </h1>

          <p className="home-hero-description">
            Descubre nuestro catálogo, guarda tus
            productos favoritos y completa tus
            compras de forma segura.
          </p>

          <div className="home-hero-actions">
            <Link
              to="/products"
              className="home-primary-button"
            >
              Ver productos
            </Link>

            <Link
              to="/register"
              className="home-secondary-button"
            >
              Crear una cuenta
            </Link>
          </div>

          <div className="home-hero-features">
            <div>
              <span className="home-feature-check">
                ✓
              </span>

              <span>Pago seguro</span>
            </div>

            <div>
              <span className="home-feature-check">
                ✓
              </span>

              <span>Wishlist</span>
            </div>

            <div>
              <span className="home-feature-check">
                ✓
              </span>

              <span>Compra sencilla</span>
            </div>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-visual-card home-visual-card-main">
            <div className="home-visual-image">
              <div className="home-visual-shape">
                PB
              </div>
            </div>

            <div className="home-visual-card-content">
              <span className="home-visual-category">
                Destacado
              </span>

              <h2>Project Break</h2>

              <p>
                Tu tienda online
              </p>

              <div className="home-visual-card-bottom">
                <strong>
                  Explorar catálogo
                </strong>

                <span>→</span>
              </div>
            </div>
          </div>

          <div className="home-floating-card home-floating-card-top">
            <span className="home-floating-icon">
              ♡
            </span>

            <div>
              <strong>
                Favoritos
              </strong>

              <span>
                Guarda lo que te gusta
              </span>
            </div>
          </div>

          <div className="home-floating-card home-floating-card-bottom">
            <span className="home-floating-icon">
              🔒
            </span>

            <div>
              <strong>
                Pago seguro
              </strong>

              <span>
                Protegido por Stripe
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <div className="home-section-heading">
          <span className="home-eyebrow">
            Una experiencia sencilla
          </span>

          <h2>
            Todo lo necesario para comprar
            cómodamente
          </h2>

          <p>
            Navega por el catálogo, organiza tus
            favoritos y gestiona tu compra desde
            un único lugar.
          </p>
        </div>

        <div className="home-benefits-grid">
          <article className="home-benefit-card">
            <div className="home-benefit-icon">
              ◇
            </div>

            <h3>
              Catálogo de productos
            </h3>

            <p>
              Consulta los productos disponibles,
              precios, categorías y stock de forma
              clara.
            </p>

            <Link to="/products">
              Explorar productos →
            </Link>
          </article>

          <article className="home-benefit-card">
            <div className="home-benefit-icon">
              ♡
            </div>

            <h3>
              Guarda tus favoritos
            </h3>

            <p>
              Añade productos a tu wishlist y
              vuelve a ellos cuando quieras.
            </p>

            <Link to="/wishlist">
              Ver wishlist →
            </Link>
          </article>

          <article className="home-benefit-card">
            <div className="home-benefit-icon">
              ✓
            </div>

            <h3>
              Checkout seguro
            </h3>

            <p>
              Revisa tu pedido y completa el pago
              mediante la plataforma segura de
              Stripe.
            </p>

            <Link to="/cart">
              Ir al carrito →
            </Link>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span className="home-cta-eyebrow">
            ¿Empezamos?
          </span>

          <h2>
            Descubre nuestro catálogo
          </h2>

          <p>
            Encuentra tus productos favoritos y
            añádelos a tu carrito en unos pocos
            pasos.
          </p>
        </div>

        <Link
          to="/products"
          className="home-cta-button"
        >
          Ver productos
        </Link>
      </section>
    </section>
  );
}

export default Home;