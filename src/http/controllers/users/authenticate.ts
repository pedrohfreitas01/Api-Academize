import { type FastifyReply, type FastifyRequest } from "fastify";
import z from "zod";

import { PrismaUsersRepository } from "repositories/prisma/prisma-users-repository.js";
import { AuthenticateUseCase } from "use-cases/authenticate.js";
import { invalidCredentialsError } from "use-cases/erros/invalid-credentials-error.js";
import { makeAuthUseCase } from "use-cases/factories/make-auth-use-case.js";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );
    return reply.status(200).send({
      token,
    });
  } catch (err) {
    if (err instanceof invalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
