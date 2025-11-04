import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "app.js";
import { createAndAuthUser } from "utils/test/create-and-auth-user.js";

describe("Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // inicializa o app sem listen
  });

  afterAll(async () => {
    await app.close(); // fecha o app
  });

  it("should be able to get user profile", async () => {
    const { token } = await createAndAuthUser(app)

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(profileResponse.statusCode).toBe(201);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: "pedro@mail.com",
      })
    );
  });
});
