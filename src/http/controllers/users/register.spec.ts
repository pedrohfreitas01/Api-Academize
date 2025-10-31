import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "app.js";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // inicializa o app sem listen
  });

  afterAll(async () => {
    await app.close(); // fecha o app
  });

  it("should be able to register a new user", async () => {
    const response = await request(app.server).post("/users").send({
      name: "Pedro Test",
      email: "pedro@test.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
    // expect(response.body.user).toHaveProperty("id");
    // expect(response.body.user.email).toBe("pedro@test.com");
  });
});
