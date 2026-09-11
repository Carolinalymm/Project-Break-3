import request from "supertest";

import app from "../src/app.js";

describe("Backend React Ready API", () => {
  describe("GET /api/health", () => {
    test("debe indicar que la API funciona", async () => {
      const response = await request(app)
        .get("/api/health")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message:
          "API funcionando correctamente",
      });

      expect(response.body.data).toEqual(
        expect.objectContaining({
          environment: "test",
          timestamp: expect.any(String),
        }),
      );
    });
  });

  describe("GET /api/docs.json", () => {
    test("debe devolver la especificación OpenAPI", async () => {
      const response = await request(app)
        .get("/api/docs.json")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.openapi).toBe(
        "3.0.3",
      );

      expect(response.body.info).toEqual(
        expect.objectContaining({
          title:
            "Backend React Ready API",
          version: "1.0.0",
        }),
      );

      expect(response.body.paths).toEqual(
        expect.objectContaining({
          "/api/health": expect.any(Object),
          "/api/auth/login":
            expect.any(Object),
          "/api/products":
            expect.any(Object),
          "/api/cart":
            expect.any(Object),
          "/api/orders":
            expect.any(Object),
        }),
      );
    });
  });

  describe("Rutas inexistentes", () => {
    test("debe devolver 404 en una ruta que no existe", async () => {
      const response = await request(app)
        .get("/api/ruta-inexistente")
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body.success).toBe(
        false,
      );

      expect(response.body.error).toEqual(
        expect.any(String),
      );
    });
  });

  describe("Protección del carrito", () => {
    test("debe impedir consultar el carrito sin autenticación", async () => {
      const response = await request(app)
        .get("/api/cart")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          error:
            "Debes iniciar sesión para acceder a esta ruta",
        }),
      );
    });
  });

  describe("Protección de las imágenes", () => {
    test("debe impedir subir imágenes sin autenticación", async () => {
      const response = await request(app)
        .post("/api/uploads/products")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          error:
            "Debes iniciar sesión para acceder a esta ruta",
        }),
      );
    });
  });
});