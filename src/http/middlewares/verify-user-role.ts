import type { FastifyReply, FastifyRequest } from "fastify";

export  function verifyUserRole(role: "ADMIN" | "MEMBER") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== "ADMIN") {
      return reply.status(403).send({ message: "Unauthorized" });
    }
  };
}
