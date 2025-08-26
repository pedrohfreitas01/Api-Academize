import type { UsersRepository } from "repositories/users-repository.js";
import { invalidCredentialsError } from "./erros/invalid-credentials-error.js";
import { compare } from "bcryptjs";
import type { User } from "@prisma/client";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    //busca o user no banco & comparar as senhas vindo e do banco
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new invalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new invalidCredentialsError();
    }

    return {
      user,
    };
  }
}
