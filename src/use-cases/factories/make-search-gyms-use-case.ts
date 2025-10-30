import { PrismaGymsRepository } from "repositories/prisma/prisma-gyms-repository.js";
import { SearchGymUseCase } from "use-cases/search-gyms.js";


export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new SearchGymUseCase(gymsRepository);

  return useCase;
}
