import { PrismaGymsRepository } from "repositories/prisma/prisma-gyms-repository.js";
import { FetchNearbyGymsUseCase } from "use-cases/fetch-nearby-gyms.js";

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUseCase(gymsRepository);

  return useCase;
}
