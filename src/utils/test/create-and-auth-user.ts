import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import { prisma } from "lib/prisma.js";
import request from "supertest";

export async function createAndAuthUser(app: FastifyInstance, isAdmin = false) {
  await prisma.user.create({
    data: {
      name: "Pedro",
      email: "pedro@mail.com",
      password_hash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "pedro@mail.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return {
    token,
  };
}
``