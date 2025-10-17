import { expect, test, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "repositories/in-memory/in-memory-check-ins-repository.js";
import { GetUserMetricUseCase } from "./get-user-metrics.js";

let checkInRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricUseCase;

describe("Get User Metrics Use Case", () => {
  // esse beforeEach serve para criar um novo repositório a cada teste
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricUseCase(checkInRepository);
  });

  it("Should be able to get check-ins count from  metrics", async () => {
    await checkInRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    await checkInRepository.create({
      gymId: "gym-02",
      userId: "user-01",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkInsCount).toEqual(2);
  });
});
