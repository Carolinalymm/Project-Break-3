import path from "node:path";
import { fileURLToPath } from "node:url";

import swaggerJsdoc from "swagger-jsdoc";

const currentFilePath = fileURLToPath(
  import.meta.url,
);

const currentDirectory = path.dirname(
  currentFilePath,
);

const productionUrl =
  process.env.API_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  "https://project-break-2-api.onrender.com";

const localPort = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Backend React Ready API",
      version: "1.0.0",
      description:
        "API REST para un comercio electrónico construida con Express, Supabase PostgreSQL, MongoDB Atlas, Cloudinary y autenticación mediante JWT.",
      contact: {
        name: "Carolina Yagüe",
      },
    },

    servers: [
      {
        url: productionUrl,
        description: "Servidor de producción",
      },
      {
        url: `http://localhost:${localPort}`,
        description: "Servidor local",
      },
    ],

    tags: [
      {
        name: "Estado",
        description:
          "Comprobaciones del estado de la aplicación y sus bases de datos",
      },
      {
        name: "Autenticación",
        description:
          "Registro, inicio y cierre de sesión",
      },
      {
        name: "Usuario",
        description:
          "Información del usuario autenticado",
      },
      {
        name: "Productos",
        description:
          "Consulta y administración de productos",
      },
      {
        name: "Reviews",
        description:
          "Opiniones y puntuaciones de productos",
      },
      {
        name: "Wishlist",
        description:
          "Lista de productos favoritos",
      },
      {
        name: "Carrito",
        description:
          "Gestión del carrito de compra",
      },
      {
        name: "Pedidos",
        description:
          "Checkout e historial de pedidos",
      },
      {
        name: "Imágenes",
        description:
          "Subida y eliminación de imágenes en Cloudinary",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description:
            "Cookie HTTP-only obtenida al iniciar sesión",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example:
                "No tienes permisos para realizar esta acción",
            },
          },
        },

        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Carolina",
            },
            email: {
              type: "string",
              format: "email",
              example:
                "carolina@example.com",
            },
            role: {
              type: "string",
              enum: [
                "USER",
                "ADMIN",
              ],
              example: "USER",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 2,
            },
            name: {
              type: "string",
              example:
                "Ratón inalámbrico",
            },
            description: {
              type: "string",
              example:
                "Ratón ergonómico con conexión Bluetooth",
            },
            category: {
              type: "string",
              example: "Informática",
            },
            price: {
              type: "number",
              format: "float",
              example: 39.99,
            },
            stock: {
              type: "integer",
              example: 25,
            },
            imageUrl: {
              type: "string",
              nullable: true,
              example:
                "https://res.cloudinary.com/example/image/upload/product.jpg",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Review: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example:
                "668f7c7af00a123456789abc",
            },
            productId: {
              type: "integer",
              example: 2,
            },
            userId: {
              type: "integer",
              example: 1,
            },
            userName: {
              type: "string",
              example: "Carolina",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            comment: {
              type: "string",
              example:
                "Producto cómodo y fácil de utilizar",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        CartItem: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            productId: {
              type: "integer",
              example: 2,
            },
            quantity: {
              type: "integer",
              example: 2,
            },
            unitPrice: {
              type: "number",
              example: 39.99,
            },
            subtotal: {
              type: "number",
              example: 79.98,
            },
            product: {
              $ref:
                "#/components/schemas/Product",
            },
          },
        },

        Cart: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            userId: {
              type: "integer",
              example: 1,
            },
            status: {
              type: "string",
              enum: [
                "ACTIVE",
                "CHECKED_OUT",
              ],
              example: "ACTIVE",
            },
            items: {
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/CartItem",
              },
            },
            totalItems: {
              type: "integer",
              example: 2,
            },
            total: {
              type: "number",
              example: 79.98,
            },
          },
        },

        OrderItem: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            orderId: {
              type: "integer",
              example: 1,
            },
            productId: {
              type: "integer",
              example: 2,
            },
            productName: {
              type: "string",
              example:
                "Ratón inalámbrico",
            },
            quantity: {
              type: "integer",
              example: 2,
            },
            unitPrice: {
              type: "number",
              example: 39.99,
            },
            subtotal: {
              type: "number",
              example: 79.98,
            },
          },
        },

        Order: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            userId: {
              type: "integer",
              example: 1,
            },
            cartId: {
              type: "integer",
              example: 1,
            },
            total: {
              type: "number",
              example: 79.98,
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "PAID",
                "CANCELLED",
              ],
              example: "PENDING",
            },
            totalItems: {
              type: "integer",
              example: 2,
            },
            items: {
              type: "array",
              items: {
                $ref:
                  "#/components/schemas/OrderItem",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        UploadedImage: {
          type: "object",
          properties: {
            publicId: {
              type: "string",
              example:
                "backend-react-ready/products/abc123",
            },
            url: {
              type: "string",
              example:
                "https://res.cloudinary.com/example/image/upload/abc123.jpg",
            },
            width: {
              type: "integer",
              example: 1000,
            },
            height: {
              type: "integer",
              example: 1000,
            },
            format: {
              type: "string",
              example: "jpg",
            },
            bytes: {
              type: "integer",
              example: 125000,
            },
          },
        },
      },
    },
  },

  apis: [
    path.resolve(
      currentDirectory,
      "../docs/*.js",
    ),
  ],
};

const swaggerSpecification =
  swaggerJsdoc(swaggerOptions);

export default swaggerSpecification;