import { expect, test, describe, it, beforeEach } from "vitest";
import { compare } from "bcryptjs";
import { InMemoryCheckInsRepository } from "repositories/in-memory/in-memory-check-ins-repository.js";
import { CheckInUseCase } from "./checkin.js";

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  // esse beforeEach serve para criar um novo repositório a cada teste
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInRepository);
  });

  it("Should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    // espera que o id do checkIn seja uma string qualquer
  expect(checkIn.id).toEqual(expect.any(String));
  });
});
