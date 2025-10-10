import { expect, test, describe, it, beforeEach, vi, afterEach } from "vitest";
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

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to check in", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)); // 20 de janeiro de 2023

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    // espera que o id do checkIn seja uma string qualquer
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)); // 20 de janeiro de 2023

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("Should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)); // 20 de janeiro de 2023

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0)); // 21

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
