import type { Gym } from "@prisma/client";
import type { GymsRepository } from "repositories/gyms-repository.js";

interface SearchGymUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymUseCaseResponse {
  gyms: Gym[];
}

//D - DEPENDENCY INVERSION PRINCIPLE

export class SearchGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    page,
    query,
  }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
