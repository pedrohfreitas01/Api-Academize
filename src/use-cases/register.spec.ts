import { expect, test, describe, it } from "vitest";
import { RegisterUseCase } from "./register.js";
import { compare } from "bcryptjs";
import { InMemoryUserRepository } from "repositories/in-memory/in-memory-users-repositoy.js";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error.js";

describe("Register Use Case", () => {
  it("should  be able to register ", async () => {
    const usersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Pedro Cafe",
      email: "pedro@mail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Pedro Cafe",
      email: "pedro@mail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "pedro@example.com";

    await registerUseCase.execute({
      name: "Pedro Cafe",
      email,
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "Pedro Cafe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
