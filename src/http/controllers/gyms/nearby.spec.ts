import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "app.js";
import { createAndAuthUser } from "utils/test/create-and-auth-user.js";

describe("Nearby Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // Inicializa o app sem listen()
  });

  afterAll(async () => {
    await app.close(); // Fecha o app após os testes
  });

  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthUser(app, true);

    await request(app.server)
      .post("/gyms") 
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym Nearby",
        description: "A gym for JavaScript enthusiasts",
        phone: "123-456-7890",
        latitude: -3.786432,
        longitude: -31.567951,
      });

    await request(app.server)
      .post("/gyms") // <--- corrigido!
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Python Gym Far Away",
        description: "A gym for JavaScript enthusiasts",
        phone: "123-456-7890",
        latitude: -23.5419,
        longitude: -46.6318,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: "-3.786432", longitude: "-31.567951" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms[0].title).toEqual("JavaScript Gym Nearby");
    // expect(response.body).toHaveProperty("gym"); // opcional: valida retorno
  });
});
