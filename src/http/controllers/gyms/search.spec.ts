import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "app.js";
import { createAndAuthUser } from "utils/test/create-and-auth-user.js";

describe("Search Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // Inicializa o app sem listen()
  });

  afterAll(async () => {
    await app.close(); // Fecha o app após os testes
  });

  it("should be able to search a gym", async () => {
    const { token } = await createAndAuthUser(app);

    await request(app.server)
      .post("/gyms") // <--- corrigido!
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "A gym for JavaScript enthusiasts",
        phone: "123-456-7890",
        latitude: 40.7128,
        longitude: -74.006,
      });

    await request(app.server)
      .post("/gyms") // <--- corrigido!
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Python Gym",
        description: "A gym for JavaScript enthusiasts",
        phone: "123-456-7890",
        latitude: 40.7128,
        longitude: -74.006,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({ query: "JavaScript" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms[0].title).toEqual("JavaScript Gym");
    // expect(response.body).toHaveProperty("gym"); // opcional: valida retorno
  });
});
