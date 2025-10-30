import { PrismaCheckInsRepository } from "repositories/prisma/prisma-check-ins-repository.js";
import { GetUserMetricUseCase } from "use-cases/get-user-metrics.js";

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetUserMetricUseCase(checkInsRepository);

  return useCase;
}
