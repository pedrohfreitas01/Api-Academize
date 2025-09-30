import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUserRepository } from "repositories/in-memory/in-memory-users-repositoy.js";
import { AuthenticateUseCase } from "./authenticate.js";
import { hash } from "bcryptjs";
import { invalidCredentialsError } from "./erros/invalid-credentials-error.js";

let usersRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should  be able to authenticate ", async () => {
    await usersRepository.create({
      name: "pedro cafe",
      email: "pedro@mail.com",
      password_hash: await hash("123456", 5),
    });

    const { user } = await sut.execute({
      email: "pedro@mail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "pedro@mail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(invalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "pedro cafe",
      email: "pedro@mail.com",
      password_hash: await hash("123456", 5),
    });

    await expect(() =>
      sut.execute({
        email: "pedro@mail.com",
        password: "121212",
      })
    ).rejects.toBeInstanceOf(invalidCredentialsError);
  });
});
