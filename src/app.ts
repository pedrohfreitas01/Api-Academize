import fastify from "fastify";
import { prisma } from "./lib/prisma.js";
import { env } from "./env/index.js";
import fastifyJwt from "@fastify/jwt";
import { ZodError } from "zod";
import { userRoutes } from "http/controllers/users/routes.js";
import { gymRoutes } from "http/controllers/gyms/routes.js";
import { checkInsRoutes } from "http/controllers/check-ins/routes.js";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET, // sem aspas!
});

app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.issues });
  }

  if (env.NODE_ENV !== "production") console.error(error);

  return reply.status(500).send({ message: "internal server error" });
});
