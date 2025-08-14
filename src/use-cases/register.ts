import { hash } from "bcryptjs";
import type { UsersRepository } from "repositories/users-repository.js";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error.js";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

//D - DEPENDENCY INVERSION PRINCIPLE

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 5);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
