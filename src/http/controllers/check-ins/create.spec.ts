import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "app.js";
import { createAndAuthUser } from "utils/test/create-and-auth-user.js";
import { prisma } from "lib/prisma.js";

describe("Create CheckIn (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // Inicializa o app sem listen()
  });

  afterAll(async () => {
    await app.close(); // Fecha o app após os testes
  });

  it("should be able to create a check-in", async () => {
    const { token } = await createAndAuthUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        latitude: 40.7128,
        longitude: -74.006,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: 40.7128,
        longitude: -74.006,
      });

    expect(response.statusCode).toEqual(201);
  });
});
