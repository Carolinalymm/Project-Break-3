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
            Todo para disfrutar
            <span> al máximo de tus partidas.</span>
          </h1>

          <p className="home-hero-description">
            Descubre nuestra selección de videojuegos,
            periféricos y accesorios gaming. Encuentra
            mandos, teclados, altavoces, consolas,
            juegos y mucho más en un único catálogo.
          </p>

          <div className="home-hero-actions">
            <Link
              to="/products"
              className="home-primary-button"
            >
              Explorar catálogo
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

              <span>Productos gaming</span>
            </div>

            <div>
              <span className="home-feature-check">
                ✓
              </span>

              <span>Wishlist personal</span>
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
                Gaming
              </span>

              <h2>Project Break</h2>

              <p>
                Videojuegos, periféricos y accesorios
              </p>

              <div className="home-visual-card-bottom">
                <strong>
                  Descubrir productos
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
                Tus favoritos
              </strong>

              <span>
                Guarda tus próximos imprescindibles
              </span>
            </div>
          </div>

          <div className="home-floating-card home-floating-card-bottom">
            <span className="home-floating-icon">
              🔒
            </span>

            <div>
              <strong>
                Compra segura
              </strong>

              <span>
                Pago protegido con Stripe
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <div className="home-section-heading">
          <span className="home-eyebrow">
            Prepara tu setup
          </span>

          <h2>
            Todo lo que necesitas para jugar
          </h2>

          <p>
            Explora productos para completar tu setup,
            ampliar tu colección de juegos o encontrar
            ese accesorio que te falta.
          </p>
        </div>

        <div className="home-benefits-grid">
          <article className="home-benefit-card">
            <div className="home-benefit-icon">
              ◇
            </div>

            <h3>
              Videojuegos y consolas
            </h3>

            <p>
              Descubre juegos, consolas y productos
              pensados para ampliar tu colección y
              disfrutar de nuevas experiencias.
            </p>

            <Link to="/products">
              Ver catálogo →
            </Link>
          </article>

          <article className="home-benefit-card">
            <div className="home-benefit-icon">
              ♡
            </div>

            <h3>
              Periféricos y accesorios
            </h3>

            <p>
              Encuentra mandos, teclados, auriculares
              y otros accesorios para completar tu
              espacio gaming.
            </p>

            <Link to="/wishlist">
              Ver favoritos →
            </Link>
          </article>

          <article className="home-benefit-card">
            <div className="home-benefit-icon">
              ✓
            </div>

            <h3>
              Compra rápida y segura
            </h3>

            <p>
              Añade tus productos al carrito, revisa
              tu pedido y completa el pago de forma
              segura mediante Stripe.
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
            Mejora tu setup
          </span>

          <h2>
            Encuentra tu próximo imprescindible gaming
          </h2>

          <p>
            Explora videojuegos, periféricos y
            accesorios disponibles y encuentra los
            productos que mejor encajan contigo.
          </p>
        </div>

        <Link
          to="/products"
          className="home-cta-button"
        >
          Explorar productos
        </Link>
      </section>
    </section>
  );
}

export default Home;