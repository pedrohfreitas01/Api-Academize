import type { CheckIn } from "@prisma/client";
import type { CheckInsRepository } from "repositories/check-ins-repository.js";

interface GetUserMetricUseCaseRequest {
  userId: string;
<<<<<<< HEAD
  page: number;
=======
  page?: number;
>>>>>>> dev
}
interface GetUserMetricUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricUseCaseRequest): Promise<GetUserMetricUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return {
        checkInsCount,
    };
  }
}
