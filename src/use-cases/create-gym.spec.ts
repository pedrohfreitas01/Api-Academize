import { InMemoryGymsRepository } from "repositories/in-memory/in-memory-gyms-repository.js";
import { CreateGymUseCase } from "./create-gym.js";
import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should  be able to register ", async () => {
    const { gym } = await sut.execute({
      title: "Academia Naruto",
      description: "Academia de jinchuuriki",
      phone: "859902928",
      latitude: -3.71722,
      longitude: -38.5433,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
