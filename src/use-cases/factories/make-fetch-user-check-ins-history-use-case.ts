import { PrismaCheckInsRepository } from "repositories/prisma/prisma-check-ins-repository.js";
import { FetchUserCheckInsHistoryUseCase } from "use-cases/fetch-user-check-ins-history.js";

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

  return useCase;
}
