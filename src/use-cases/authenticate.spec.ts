import { expect, describe, it } from "vitest";
import { InMemoryUserRepository } from "repositories/in-memory/in-memory-users-repositoy.js";
import { AuthenticateUseCase } from "./authenticate.js";
import { hash } from "bcryptjs";
import { invalidCredentialsError } from "./erros/invalid-credentials-error.js";

describe("Authenticate Use Case", () => {
  it("should  be able to authenticate ", async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(usersRepository);

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
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    expect(() =>
      sut.execute({
        email: "pedro@mail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(invalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "pedro cafe",
      email: "pedro@mail.com",
      password_hash: await hash("123456", 5),
    });

    expect(() =>
      sut.execute({
        email: "pedro@mail.com",
        password: "121212",
      })
    ).rejects.toBeInstanceOf(invalidCredentialsError);
  });
});
