import { type FastifyReply, type FastifyRequest } from "fastify";
import { makeGetUserProfileUseCase } from "use-cases/factories/make-get-user-profile-use-case.js";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // console.log(request.headers);

  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  });

  return reply.status(201).send({
    user: {
      ...user,
      password_hash: undefined, // nao retornar a senha
    },
  });
}
