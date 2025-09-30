import type { UsersRepository } from "repositories/users-repository.js";
import { invalidCredentialsError } from "./erros/invalid-credentials-error.js";
import { compare } from "bcryptjs";
import type { User } from "@prisma/client";
import { ResourceNotFoundError } from "./erros/resource-not-found-error.js";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    //busca o user no banco & comparar as senhas vindo e do banco
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
