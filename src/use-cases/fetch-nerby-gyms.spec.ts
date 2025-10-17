import { InMemoryGymsRepository } from "repositories/in-memory/in-memory-gyms-repository.js";
import { expect, test, describe, it, beforeEach, vi, afterEach } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.js";

let gymsRepository: InMemoryGymsRepository;

let sut: FetchNearbyGymsUseCase;

describe("Fetch User CheckIn history Use Case", () => {
  // esse beforeEach serve para criar um novo repositório a cada teste
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("Should be able to fetch nearby  gym", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -3.786432,
      longitude: -31.567951,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -23.5419,
      longitude: -46.6318,
    });

    const { gyms } = await sut.execute({
      userLatitude: -3.786432,
      userLongitude: -31.567951,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
