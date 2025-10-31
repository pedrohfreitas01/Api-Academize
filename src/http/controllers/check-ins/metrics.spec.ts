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

  it("should be able to get the total count of the check-in", async () => {
    const { token } = await createAndAuthUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        latitude: 40.7128,
        longitude: -74.006,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gymId: gym.id,
          userId: user.id,
        },
        {
          gymId: gym.id,
          userId: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get("/check-ins/metrics")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkInsCount).toEqual(2);
  });
});
