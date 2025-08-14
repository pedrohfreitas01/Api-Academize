import fastify from "fastify";
import { prisma } from "./lib/prisma.js";
import z, { ZodError } from "zod";
import { appRoutes } from "http/routes.js";
import { env } from "env/index.js";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: z.treeifyError(error) });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: fazer um log DataLog
  }

  return reply.status(500).send({ message: "internal server error" });
});

app.listen({ port: 3333 }).then(() => {
  console.log("🚀 Server running on http://localhost:3333");
});
