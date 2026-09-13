# Project Break 3 – E-commerce

Aplicación **full-stack de comercio electrónico**.

El proyecto incluye catálogo de productos, autenticación de usuarios, wishlist, carrito de compra, panel de administración, gestión de imágenes con Cloudinary y pagos completos mediante Stripe.

---

## Demo

| Servicio | Enlace |
| --- | --- |
| Frontend | https://mellow-lolly-1c9b06.netlify.app/ |
| Backend API | https://project-break-3.onrender.com |
| Swagger | https://project-break-3.onrender.com/api/docs |
| OpenAPI | https://project-break-3.onrender.com/api/docs.json |

> El backend está desplegado en Render y puede tardar unos segundos en responder después de un periodo de inactividad.

---

## Funcionalidades

### Usuarios

- Registro e inicio de sesión.
- Cierre de sesión.
- Persistencia de sesión.
- Autenticación mediante JWT.
- JWT almacenado en cookie HTTP-only.
- Roles `USER` y `ADMIN`.
- Protección de rutas según autenticación y rol.

### Catálogo

- Visualización de productos.
- Nombre, descripción, categoría, precio, stock e imagen.
- Control de disponibilidad.
- Bloqueo de compra para productos sin stock.

### Wishlist

- Wishlist individual para cada usuario.
- Añadir productos.
- Eliminar productos.
- Persistencia mediante MongoDB Atlas.

### Carrito

- Añadir productos.
- Eliminar productos.
- Modificar cantidades.
- Cálculo automático de subtotales.
- Cálculo del total del carrito.
- Control de stock.

### Checkout y Stripe

- Resumen del pedido.
- Stripe Checkout.
- Redirección segura a Stripe.
- Webhook de confirmación.
- Pedidos con estado `PAID`.
- Actualización del stock.
- Carrito marcado como `CHECKED_OUT`.
- Página de confirmación de compra.

### Administración

Acceso exclusivo para usuarios con rol `ADMIN`.

El panel permite:

- crear productos;
- editar productos;
- eliminar productos;
- modificar nombre, descripción y categoría;
- modificar precio y stock;
- subir imágenes;
- cambiar la imagen de un producto.

### Imágenes

- Cloudinary.
- Multer.
- Formatos JPEG, PNG y WebP.
- Tamaño máximo de 5 MB.
- Validación en frontend y backend.

---

## Tecnologías

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- CSS

### Backend

- Node.js
- Express
- JWT
- Cookie Parser
- bcryptjs
- CORS

### Datos y servicios

- PostgreSQL
- Supabase
- MongoDB Atlas
- Mongoose
- Cloudinary
- Multer
- Stripe
- Swagger / OpenAPI

### Testing y despliegue

- Jest
- Supertest
- Netlify
- Render

---

## Arquitectura

```text
                ┌──────────────────────┐
                │    React + Vite      │
                │       Frontend       │
                └──────────┬───────────┘
                           │
                  Axios + credentials
                           │
                           ▼
                ┌──────────────────────┐
                │  Node.js + Express   │
                │         API          │
                └──────────┬───────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 Supabase/PostgreSQL  MongoDB Atlas     Cloudinary
        │
        ▼
      Stripe

El frontend realiza las peticiones autenticadas mediante:

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

El JWT se almacena en una cookie HTTP-only y no depende de localStorage.

Flujo de compra
Catálogo
   ↓
Carrito
   ↓
Checkout
   ↓
Stripe Checkout
   ↓
Pago
   ↓
Webhook
   ↓
Pedido PAID
   ↓
Confirmación
Seguridad

El proyecto incorpora:

contraseñas procesadas con bcrypt;
JWT mediante cookies HTTP-only;
cookies seguras en producción;
rutas protegidas;
autorización mediante roles;
CORS;
variables de entorno;
validaciones frontend y backend;
protección de operaciones administrativas;
validación de archivos;
verificación de firma del webhook de Stripe;
Row Level Security en Supabase.
Estructura principal
project-break-3/
│
├── database/
│   ├── checkout.sql
│   └── schema.sql
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
├── tests/
├── netlify.toml
├── package.json
└── README.md
Instalación

Clona el repositorio:

git clone https://github.com/carolinalymm/project-break-3.git
cd project-break-3
Backend
npm install
npm run dev

Por defecto:

http://localhost:3000
Frontend
cd frontend
npm install
npm run dev

Por defecto:

http://localhost:5173
Variables de entorno
Backend
PORT=3000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3000

SUPABASE_URL=
SUPABASE_SECRET_KEY=

MONGO_CONNECT=true
MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_FRONTEND_URL=http://localhost:5173
Frontend
VITE_API_URL=http://localhost:3000

Las claves privadas nunca deben almacenarse en el frontend ni subirse al repositorio.

Endpoints principales
Método	Endpoint	Acceso
POST	/api/auth/register	Público
POST	/api/auth/login	Público
POST	/api/auth/logout	Autenticado
GET	/api/me	Autenticado
GET	/api/products	Público
POST	/api/products	ADMIN
PUT	/api/products/:id	ADMIN
DELETE	/api/products/:id	ADMIN
GET	/api/wishlist	Autenticado
POST	/api/wishlist/:productId	Autenticado
DELETE	/api/wishlist/:productId	Autenticado
GET	/api/cart	Autenticado
POST	/api/cart/items	Autenticado
PUT	/api/cart/items/:itemId	Autenticado
DELETE	/api/cart/items/:itemId	Autenticado
GET	/api/orders	Autenticado
POST	/api/payments/create-checkout-session	Autenticado
POST	/api/payments/webhook	Stripe
POST	/api/uploads/products	ADMIN

La documentación completa de la API está disponible mediante Swagger:

https://project-break-3.onrender.com/api/docs

Pruebas

El backend utiliza Jest y Supertest.

npm test

También están disponibles:

npm run test:watch
npm run test:coverage

Las dependencias del proyecto también se han revisado mediante:

npm audit
Despliegue
Frontend

Desplegado en Netlify:

https://mellow-lolly-1c9b06.netlify.app/

Backend

Desplegado en Render:

https://project-break-3.onrender.com

Base de datos y servicios
Supabase
MongoDB Atlas
Cloudinary
Stripe
Estado del proyecto

Project Break 3 dispone de un flujo completo de e-commerce:

registro → catálogo → wishlist/carrito → checkout → Stripe → pago → confirmación

El proyecto se encuentra funcional, desplegado y preparado para demostración.


Autora
Carolina Yagüe