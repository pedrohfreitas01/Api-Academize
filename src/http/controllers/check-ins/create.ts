import { type FastifyReply, type FastifyRequest } from "fastify";
import z from "zod";

import { makeCheckInUseCase } from "use-cases/factories/make-check-in-use-case.js";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.uuid(),
  });

  const createCheckInsBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInsParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInsBodySchema.parse(request.body);

  const checkInsUseCase = makeCheckInUseCase();

  await checkInsUseCase.execute({
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
    userId: request.user.sub,
  });

  return reply.status(201).send({ message: "ok tudo feito" });
}
