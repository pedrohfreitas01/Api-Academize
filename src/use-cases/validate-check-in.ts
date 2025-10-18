import type { CheckIn } from "@prisma/client";
import type { CheckInsRepository } from "repositories/check-ins-repository.js";
import { ResourceNotFoundError } from "./erros/resource-not-found-error.js";
import dayjs from "dayjs";
import { check } from "zod";
import { LateCheckInValidationError } from "./erros/late-check-in-validation-error.js";

interface ValidateCheckInUseCaseRequest {
  userId: string;
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes"
    );

    if (distanceInMinutesFromCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
