import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUserRepository } from "repositories/in-memory/in-memory-users-repositoy.js";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile.js";
import { ResourceNotFoundError } from "./erros/resource-not-found-error.js";

let usersRepository: InMemoryUserRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should  be able to get user profile ", async () => {
    const createdUser = await usersRepository.create({
      name: "pedro cafe",
      email: "pedro@mail.com",
      password_hash: await hash("123456", 5),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to get user profile with wrong id"),
    async () => {
      await expect(() =>
        sut.execute({
          userId: "non-existent-id",
        })
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    };
});
