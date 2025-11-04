import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "app.js";
import { createAndAuthUser } from "utils/test/create-and-auth-user.js";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // Inicializa o app sem listen()
  });

  afterAll(async () => {
    await app.close(); // Fecha o app após os testes
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthUser(app, true);

    const response = await request(app.server)
      .post("/gyms") // <--- corrigido!
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "A gym for JavaScript enthusiasts",
        phone: "123-456-7890",
        latitude: 40.7128,
        longitude: -74.006,
      });

    expect(response.statusCode).toEqual(201);
    // expect(response.body).toHaveProperty("gym"); // opcional: valida retorno
  });
});
