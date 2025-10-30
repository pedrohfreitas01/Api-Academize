import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeValidateCheckInUseCase } from "use-cases/factories/make-validate-check-in-use-case.js";
import z from "zod";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInsParamsSchema = z.object({
    checkInId: z.uuid(),
  });

  const { checkInId } = validateCheckInsParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({
    checkInId,
    userId: request.user.sub,
  });

  return reply.status(204).send();
}
