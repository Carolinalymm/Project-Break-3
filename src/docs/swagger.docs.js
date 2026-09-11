/*
 * Este archivo solamente contiene documentación OpenAPI.
 * No ejecuta lógica de la aplicación.
 */

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Estado
 *     summary: Comprobar el estado de la API
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 */

/**
 * @openapi
 * /api/health/database:
 *   get:
 *     tags:
 *       - Estado
 *     summary: Comprobar la conexión con PostgreSQL
 *     responses:
 *       200:
 *         description: Conexión con Supabase correcta
 *       500:
 *         description: Error de conexión
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /api/health/mongodb:
 *   get:
 *     tags:
 *       - Estado
 *     summary: Comprobar la conexión con MongoDB
 *     responses:
 *       200:
 *         description: Conexión con MongoDB Atlas correcta
 *       500:
 *         description: Error de conexión
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Carolina
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carolina@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos no válidos
 *       409:
 *         description: El correo ya está registrado
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     description: Guarda el JWT en una cookie HTTP-only llamada accessToken.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: carolina@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *         headers:
 *           Set-Cookie:
 *             description: Cookie HTTP-only con el token JWT
 *             schema:
 *               type: string
 *       401:
 *         description: Credenciales incorrectas
 */

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Cerrar sesión
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */

/**
 * @openapi
 * /api/me:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Obtener el usuario autenticado
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *       401:
 *         description: Sesión no válida
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener los productos activos
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente
 *   post:
 *     tags:
 *       - Productos
 *     summary: Crear un producto
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ratón inalámbrico
 *               description:
 *                 type: string
 *                 example: Ratón ergonómico con conexión Bluetooth
 *               category:
 *                 type: string
 *                 example: Informática
 *               price:
 *                 type: number
 *                 example: 39.99
 *               stock:
 *                 type: integer
 *                 example: 25
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *                 example: https://res.cloudinary.com/example/image/upload/product.jpg
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: Sesión no válida
 *       403:
 *         description: Se requiere el rol ADMIN
 */

/**
 * @openapi
 * /api/products/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: Identificador del producto
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener un producto
 *     responses:
 *       200:
 *         description: Producto obtenido correctamente
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     tags:
 *       - Productos
 *     summary: Actualizar un producto
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ratón inalámbrico Pro
 *               description:
 *                 type: string
 *                 example: Ratón actualizado
 *               category:
 *                 type: string
 *                 example: Informática
 *               price:
 *                 type: number
 *                 example: 44.99
 *               stock:
 *                 type: integer
 *                 example: 20
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       403:
 *         description: Se requiere el rol ADMIN
 *       404:
 *         description: Producto no encontrado
 *   delete:
 *     tags:
 *       - Productos
 *     summary: Desactivar un producto
 *     description: Realiza una eliminación lógica estableciendo is_active en false.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       403:
 *         description: Se requiere el rol ADMIN
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @openapi
 * /api/products/{id}/reviews:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: Identificador del producto
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Obtener las reviews de un producto
 *     responses:
 *       200:
 *         description: Reviews obtenidas correctamente
 *       404:
 *         description: Producto no encontrado
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Crear una review
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 1000
 *                 example: Producto cómodo y fácil de utilizar
 *     responses:
 *       201:
 *         description: Review creada correctamente
 *       401:
 *         description: Sesión no válida
 *       409:
 *         description: El usuario ya publicó una review
 */

/**
 * @openapi
 * /api/reviews/{reviewId}:
 *   parameters:
 *     - in: path
 *       name: reviewId
 *       required: true
 *       schema:
 *         type: string
 *       description: Identificador de MongoDB de la review
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Actualizar una review
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Después de probarlo, funciona muy bien
 *     responses:
 *       200:
 *         description: Review actualizada correctamente
 *       403:
 *         description: El usuario no es el autor ni administrador
 *       404:
 *         description: Review no encontrada
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Eliminar una review
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Review eliminada correctamente
 *       403:
 *         description: El usuario no es el autor ni administrador
 *       404:
 *         description: Review no encontrada
 */

/**
 * @openapi
 * /api/wishlist:
 *   get:
 *     tags:
 *       - Wishlist
 *     summary: Obtener la wishlist
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Wishlist obtenida correctamente
 *       401:
 *         description: Sesión no válida
 */

/**
 * @openapi
 * /api/wishlist/{productId}:
 *   parameters:
 *     - in: path
 *       name: productId
 *       required: true
 *       schema:
 *         type: integer
 *       description: Identificador del producto
 *   post:
 *     tags:
 *       - Wishlist
 *     summary: Añadir un producto a la wishlist
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Producto añadido correctamente
 *       409:
 *         description: El producto ya está en la wishlist
 *   delete:
 *     tags:
 *       - Wishlist
 *     summary: Eliminar un producto de la wishlist
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: El producto no está en la wishlist
 */

/**
 * @openapi
 * /api/cart:
 *   get:
 *     tags:
 *       - Carrito
 *     summary: Obtener el carrito activo
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrito obtenido correctamente
 *       401:
 *         description: Sesión no válida
 */

/**
 * @openapi
 * /api/cart/items:
 *   post:
 *     tags:
 *       - Carrito
 *     summary: Añadir un producto al carrito
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Producto añadido correctamente
 *       200:
 *         description: Cantidad incrementada correctamente
 *       409:
 *         description: Stock insuficiente
 */

/**
 * @openapi
 * /api/cart/items/{itemId}:
 *   parameters:
 *     - in: path
 *       name: itemId
 *       required: true
 *       schema:
 *         type: integer
 *       description: Identificador del elemento del carrito
 *   put:
 *     tags:
 *       - Carrito
 *     summary: Cambiar la cantidad de un producto
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cantidad actualizada correctamente
 *       404:
 *         description: Elemento no encontrado
 *       409:
 *         description: Stock insuficiente
 *   delete:
 *     tags:
 *       - Carrito
 *     summary: Eliminar un producto del carrito
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Elemento no encontrado
 */

/**
 * @openapi
 * /api/cart/checkout:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Convertir el carrito activo en un pedido
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *       404:
 *         description: No existe un carrito activo
 *       409:
 *         description: Carrito vacío, producto no disponible o stock insuficiente
 */

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener el historial de pedidos
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Pedidos obtenidos correctamente
 *       401:
 *         description: Sesión no válida
 */

/**
 * @openapi
 * /api/orders/{orderId}:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener un pedido concreto
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del pedido
 *     responses:
 *       200:
 *         description: Pedido obtenido correctamente
 *       404:
 *         description: Pedido no encontrado
 */

/**
 * @openapi
 * /api/uploads/products:
 *   post:
 *     tags:
 *       - Imágenes
 *     summary: Subir una imagen de producto
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagen subida correctamente
 *       400:
 *         description: Archivo no válido
 *       403:
 *         description: Se requiere el rol ADMIN
 *       502:
 *         description: Error al comunicarse con Cloudinary
 *   delete:
 *     tags:
 *       - Imágenes
 *     summary: Eliminar una imagen de Cloudinary
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicId
 *             properties:
 *               publicId:
 *                 type: string
 *                 example: backend-react-ready/products/abc123
 *     responses:
 *       200:
 *         description: Imagen eliminada correctamente
 *       403:
 *         description: Se requiere el rol ADMIN
 *       404:
 *         description: Imagen no encontrada
 */