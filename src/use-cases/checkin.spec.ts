import { expect, test, describe, it, beforeEach, vi, afterEach } from "vitest";
import { compare } from "bcryptjs";
import { InMemoryCheckInsRepository } from "repositories/in-memory/in-memory-check-ins-repository.js";
import { CheckInUseCase } from "./checkin.js";
import { InMemoryGymsRepository } from "repositories/in-memory/in-memory-gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-check-ins-error.js";
import { MaxDistanceError } from "./erros/max-distance-error.js";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  // esse beforeEach serve para criar um novo repositório a cada teste
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Academia do Naruto",
      description: "",
      latitude: -3.785578,
      longitude: -38.567547,
      phone: "",
    });

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
      userLatitude: -3.785578,
      userLongitude: -38.567547,
    });

    // espera que o id do checkIn seja uma string qualquer
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)); // 20 de janeiro de 2023

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -3.785578,
      userLongitude: -38.567547,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -3.785578,
        userLongitude: -38.567547,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("Should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2025, 10, 15, 8, 0, 0)); // 20 de janeiro de 2023

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -3.785578,
      userLongitude: -38.567547,
    });

    vi.setSystemTime(new Date(2025, 10, 16, 8, 0, 0)); // 21

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -3.785578,
      userLongitude: -38.567547,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Academia do Kakashi",
      description: "",
      latitude: new Decimal(-3.785851),
      longitude: new Decimal(-38.567557),
      phone: "",
    });

    expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -3.786432,
        userLongitude: -31.567951,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
