import { InMemoryGymsRepository } from "repositories/in-memory/in-memory-gyms-repository.js";
import { expect, test, describe, it, beforeEach, vi, afterEach } from "vitest";
import { SearchGymUseCase } from "./search-gyms.js";

let gymsRepository: InMemoryGymsRepository;

let sut: SearchGymUseCase;

describe("Fetch User CheckIn history Use Case", () => {
  // esse beforeEach serve para criar um novo repositório a cada teste
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it("Should be able to search for a gym", async () => {
    await gymsRepository.create({
      title: "Konoha Gym",
      description: null,
      phone: null,
      latitude: -23.5489,
      longitude: -46.6388,
    });

    await gymsRepository.create({
      title: "Akatsuki Gym",
      description: null,
      phone: null,
      latitude: -23.5489,
      longitude: -46.6388,
    });

    const { gyms } = await sut.execute({
      query: "Konoha",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Konoha Gym" })]);
  });

  it.skip("Should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Akatsuki Gym ${i}`,
        description: null,
        phone: null,
        latitude: -23.5489,
        longitude: -46.6388,
      });
    }

    const { gyms } = await sut.execute({
      query: "Akatsuki",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Akatsuki Gym 21" }),
      expect.objectContaining({ title: "Akatsuki Gym 22" }),
    ]);
  });
});
