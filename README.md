# Backend React Ready

API REST para un e-commerce desarrollada con Node.js y Express, preparada para conectarse a un frontend creado con React.

El proyecto utiliza PostgreSQL mediante Supabase para los datos principales del comercio, MongoDB Atlas para reviews y wishlists, Cloudinary para almacenar imágenes y autenticación con JWT mediante cookies HTTP-only.

## API desplegada

- API: https://project-break-2-api.onrender.com
- Swagger: https://project-break-2-api.onrender.com/api/docs
- Especificación OpenAPI: https://project-break-2-api.onrender.com/api/docs.json

> El servicio de Render puede tardar unos segundos en responder después de un periodo de inactividad.

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Token almacenado en una cookie HTTP-only.
- Roles `USER` y `ADMIN`.
- CRUD de productos.
- Eliminación lógica de productos.
- Reviews y puntuaciones de productos.
- Una review por usuario y producto.
- Wishlist personal para cada usuario.
- Carrito de compra.
- Control de cantidades y stock.
- Checkout transaccional en PostgreSQL.
- Creación e historial de pedidos.
- Subida y eliminación de imágenes con Cloudinary.
- Documentación interactiva con Swagger.
- Pruebas de integración con Jest y Supertest.
- Despliegue automático en Render.

## Tecnologías utilizadas

### Backend

- Node.js
- Express
- ECMAScript Modules
- Cookie Parser
- CORS

### Base de datos relacional

- PostgreSQL
- Supabase
- Supabase JavaScript Client

PostgreSQL almacena:

- usuarios;
- productos;
- carritos;
- elementos del carrito;
- pedidos;
- líneas de pedido.

### Base de datos documental

- MongoDB Atlas
- Mongoose

MongoDB almacena:

- reviews;
- wishlists.

### Autenticación y seguridad

- JSON Web Tokens
- bcryptjs
- Cookies HTTP-only
- Roles y permisos
- Variables de entorno
- Row Level Security en Supabase

### Imágenes

- Cloudinary
- Multer

### Documentación

- Swagger UI Express
- Swagger JSDoc
- OpenAPI 3.0.3

### Pruebas

- Jest
- Supertest

### Despliegue

- Render
- Supabase
- MongoDB Atlas
- Cloudinary

## Requisitos

- Node.js 20.19 o superior.
- Una cuenta y proyecto en Supabase.
- Un clúster en MongoDB Atlas.
- Una cuenta en Cloudinary.

## Instalación

Clona el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entra en la carpeta:

```bash
cd Project_Break-2
```

Instala las dependencias:

```bash
npm install
```

Crea el archivo de variables de entorno:

```bash
cp -n .env.example .env
```

Completa el archivo `.env` con tus credenciales reales.

## Variables de entorno

```env
# Servidor
PORT=3000
NODE_ENV=development

# Frontend autorizado mediante CORS
FRONTEND_URL=http://localhost:5173

# URL pública de la API utilizada por Swagger
API_URL=http://localhost:3000

# Supabase PostgreSQL
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SECRET_KEY=tu_clave_service_role_de_supabase

# MongoDB Atlas
MONGO_CONNECT=false
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/backend_react_ready?retryWrites=true&w=majority

# Autenticación JWT
JWT_SECRET=sustituye_por_un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

El archivo `.env` contiene información privada y no debe subirse a GitHub.

En producción se debe configurar:

```env
NODE_ENV=production
MONGO_CONNECT=true
API_URL=https://tu-api.onrender.com
FRONTEND_URL=https://tu-frontend.com
```

## Configuración de Supabase

Abre el SQL Editor de Supabase y ejecuta primero:

```text
database/schema.sql
```

Este archivo crea:

- tablas;
- claves primarias y foráneas;
- restricciones;
- índices;
- triggers para `updated_at`;
- configuración de Row Level Security;
- permisos para `service_role`.

Después ejecuta:

```text
database/checkout.sql
```

Este archivo crea la función PostgreSQL:

```text
checkout_cart
```

La función realiza el checkout dentro de una transacción:

1. Busca y bloquea el carrito activo.
2. Comprueba que no esté vacío.
3. Valida los productos y su stock.
4. Crea el pedido.
5. Crea las líneas del pedido.
6. Descuenta el stock.
7. Marca el carrito como `CHECKED_OUT`.
8. Devuelve el identificador del pedido.

Si alguna operación falla, PostgreSQL deshace toda la transacción.

## Configuración de MongoDB Atlas

Crea un usuario de base de datos en MongoDB Atlas y permite la conexión desde Render.

Añade la cadena de conexión a:

```env
MONGO_URI=mongodb+srv://...
```

En producción activa la conexión:

```env
MONGO_CONNECT=true
```

En entornos donde no se quiera conectar a MongoDB al arrancar:

```env
MONGO_CONNECT=false
```

## Configuración de Cloudinary

Obtén estos datos desde el panel de Cloudinary:

- Cloud name;
- API Key;
- API Secret.

Añádelos al `.env` y a las variables de entorno de Render:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Las imágenes se almacenan en la carpeta:

```text
backend-react-ready/products
```

Formatos permitidos:

- JPEG;
- PNG;
- WebP.

Tamaño máximo:

```text
5 MB
```

## Ejecutar en desarrollo

```bash
npm run dev
```

El servidor se reiniciará automáticamente mediante Nodemon.

## Ejecutar en producción

```bash
npm start
```

Por defecto, la API estará disponible en:

```text
http://localhost:3000
```

## Scripts disponibles

```bash
npm run dev
```

Ejecuta el servidor con Nodemon.

```bash
npm start
```

Ejecuta el servidor con Node.js.

```bash
npm test
```

Ejecuta todas las pruebas una vez.

```bash
npm run test:watch
```

Ejecuta Jest en modo observación.

```bash
npm run test:coverage
```

Ejecuta las pruebas y genera el informe de cobertura.

## Endpoints

### Estado

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Comprueba el estado de la API |
| GET | `/api/health/database` | Comprueba la conexión con Supabase |
| GET | `/api/health/mongodb` | Comprueba la conexión con MongoDB |

### Autenticación

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/register` | Registra un usuario | Público |
| POST | `/api/auth/login` | Inicia sesión | Público |
| POST | `/api/auth/logout` | Cierra la sesión | Autenticado |
| GET | `/api/me` | Devuelve el usuario actual | Autenticado |

### Productos

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/products` | Obtiene los productos activos | Público |
| GET | `/api/products/:id` | Obtiene un producto | Público |
| POST | `/api/products` | Crea un producto | ADMIN |
| PUT | `/api/products/:id` | Actualiza un producto | ADMIN |
| DELETE | `/api/products/:id` | Desactiva un producto | ADMIN |

La eliminación de productos es lógica. El producto permanece en PostgreSQL, pero pasa a tener:

```text
is_active = false
```

### Reviews

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/products/:id/reviews` | Obtiene las reviews de un producto | Público |
| POST | `/api/products/:id/reviews` | Crea una review | Autenticado |
| PUT | `/api/reviews/:reviewId` | Actualiza una review | Autor o ADMIN |
| DELETE | `/api/reviews/:reviewId` | Elimina una review | Autor o ADMIN |

Cada usuario solo puede publicar una review por producto.

La puntuación debe ser un número entero entre `1` y `5`.

### Wishlist

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/wishlist` | Obtiene la wishlist | Autenticado |
| POST | `/api/wishlist/:productId` | Añade un producto | Autenticado |
| DELETE | `/api/wishlist/:productId` | Elimina un producto | Autenticado |

Cada usuario dispone de su propia wishlist.

### Carrito

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/cart` | Obtiene el carrito activo | Autenticado |
| POST | `/api/cart/items` | Añade un producto | Autenticado |
| PUT | `/api/cart/items/:itemId` | Cambia una cantidad | Autenticado |
| DELETE | `/api/cart/items/:itemId` | Elimina un elemento | Autenticado |
| POST | `/api/cart/checkout` | Convierte el carrito en un pedido | Autenticado |

Ejemplo para añadir un producto:

```json
{
  "productId": 2,
  "quantity": 2
}
```

Ejemplo para cambiar la cantidad:

```json
{
  "quantity": 3
}
```

### Pedidos

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/orders` | Obtiene el historial de pedidos | Autenticado |
| GET | `/api/orders/:orderId` | Obtiene un pedido | Propietario |

El usuario solo puede consultar sus propios pedidos.

### Imágenes

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/uploads/products` | Sube una imagen | ADMIN |
| DELETE | `/api/uploads/products` | Elimina una imagen | ADMIN |

Para subir una imagen se debe utilizar:

```text
multipart/form-data
```

El campo del archivo debe llamarse:

```text
image
```

Para eliminar una imagen:

```json
{
  "publicId": "backend-react-ready/products/identificador"
}
```

### Documentación

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/docs` | Interfaz visual de Swagger |
| GET | `/api/docs.json` | Especificación OpenAPI en JSON |

## Autenticación desde React

El servidor guarda el JWT dentro de una cookie HTTP-only llamada:

```text
accessToken
```

Las peticiones del frontend deben enviar las credenciales.

Ejemplo con `fetch`:

```js
const response = await fetch(
  "https://project-break-2-api.onrender.com/api/me",
  {
    credentials: "include",
  },
);
```

Ejemplo de inicio de sesión:

```js
const response = await fetch(
  "https://project-break-2-api.onrender.com/api/auth/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: "usuario@example.com",
      password: "Password123",
    }),
  },
);
```

## Formato de las respuestas

Respuesta correcta:

```json
{
  "success": true,
  "message": "Operación realizada correctamente",
  "data": {}
}
```

Respuesta de error:

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## Pruebas automáticas

Las pruebas utilizan Jest y Supertest.

Actualmente se comprueba:

- estado general de la API;
- generación de la documentación OpenAPI;
- respuesta de rutas inexistentes;
- protección del carrito;
- protección de la subida de imágenes.

Ejecutar:

```bash
npm test
```

Resultado esperado:

```text
Test Suites: 1 passed
Tests:       5 passed
```

Los avisos de `VM Modules` y `WASI` pueden aparecer al ejecutar Jest dentro de StackBlitz porque el proyecto utiliza ECMAScript Modules y WebContainer.

## Estructura principal

```text
Project_Break-2/
├── database/
│   ├── checkout.sql
│   └── schema.sql
├── src/
│   ├── config/
│   │   ├── auth.js
│   │   ├── cloudinary.js
│   │   ├── database.js
│   │   ├── mongo.js
│   │   └── swagger.js
│   ├── controllers/
│   ├── docs/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
│   ├── app.test.js
│   └── setupEnv.js
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

## Seguridad

- Las contraseñas se almacenan cifradas con bcrypt.
- Las credenciales se guardan en variables de entorno.
- El JWT se almacena en una cookie HTTP-only.
- Las rutas administrativas requieren el rol `ADMIN`.
- Los usuarios solo pueden acceder a sus propios carritos y pedidos.
- Las reviews solo pueden ser modificadas por su autor o un administrador.
- Supabase utiliza Row Level Security.
- La clave `service_role` solo se utiliza en el backend.
- Las imágenes están limitadas por tipo y tamaño.
- Los errores se gestionan mediante un middleware global.

## Despliegue en Render

Configuración principal:

```text
Build Command: npm install
Start Command: npm start
```

Variables necesarias:

```text
NODE_ENV
FRONTEND_URL
API_URL
SUPABASE_URL
SUPABASE_SECRET_KEY
MONGO_CONNECT
MONGO_URI
JWT_SECRET
JWT_EXPIRES_IN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Cada nuevo `push` a la rama principal puede iniciar un despliegue automático en Render.

## Estado del proyecto

El backend incluye las funcionalidades principales necesarias para conectarse a una aplicación React:

- autenticación;
- usuarios;
- productos;
- reviews;
- wishlist;
- carrito;
- checkout;
- pedidos;
- imágenes;
- documentación;
- pruebas;
- despliegue.

## Autora

Carolina Yagüe