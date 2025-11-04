import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "app.js";

describe("Refresh Token (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // inicializa o app sem listen
  });

  afterAll(async () => {
    await app.close(); // fecha o app
  });

  it("should be able to refresh a token", async () => {
    await request(app.server).post("/users").send({
      name: "Pedro Test",
      email: "pedro@test.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "pedro@test.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie") || [];
    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    // expect(response.body.user.email).toBe("pedro@test.com");
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
