import type { CheckIn } from "@prisma/client";
import type { CheckInsRepository } from "repositories/check-ins-repository.js";
import type { GymsRepository } from "repositories/gyms-repository.js";
import { ResourceNotFoundError } from "./erros/resource-not-found-error.js";
import { getDistanceBetweenCoordinates } from "utils/get-distance-between-coords.js";
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-check-ins-error.js";
import { MaxDistanceError } from "./erros/max-distance-error.js";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // calculate distance between user and gym
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const MAX_DISTANCE_KM = 0.1;
    // maior que 100 metros
    if (distance > MAX_DISTANCE_KM) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      gymId: gymId,
      userId: userId,
    });

    return {
      checkIn,
    };
  }
}
