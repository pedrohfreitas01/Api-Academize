import { expect, test, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "repositories/in-memory/in-memory-check-ins-repository.js";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.js";

let checkInRepository: InMemoryCheckInsRepository;

let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User CheckIn history Use Case", () => {
  // esse beforeEach serve para criar um novo repositório a cada teste
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
  });

  it("Should be able to fetch a check-in history", async () => {
    await checkInRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    await checkInRepository.create({
      gymId: "gym-02",
      userId: "user-01",
    });

    const { checkIns } = await sut.execute({
        userId: "user-01",
        page: 1
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: "gym-01" }),
      expect.objectContaining({ gymId: "gym-02" }),
    ]);
  });

  it("Should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gymId: `gym-${i}`,
        userId: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
        userId: "user-01",
        page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: "gym-21" }),
      expect.objectContaining({ gymId: "gym-22" }),
    ]);
  });
});
