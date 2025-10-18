import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "repositories/in-memory/in-memory-check-ins-repository.js";
import { ValidateCheckInUseCase } from "./validate-check-in.js";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate check-in Use Case", () => {
  // esse beforeEach serve para criar um novo repositório a cada teste
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to validate check-in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
      userId: "user-01",
    });

    // espera que o id do checkIn seja uma string qualquer
    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0]?.validated_at).toEqual(expect.any(Date));
  });

  it("Should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40)); // 1 de janeiro de 2024, 13:40

    const createdCheckIn = await checkInRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
        userId: "user-01",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
