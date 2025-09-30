import { PrismaUsersRepository } from "repositories/prisma/prisma-users-repository.js";
import { AuthenticateUseCase } from "use-cases/authenticate.js";


export function makeAuthUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const authUseCase = new AuthenticateUseCase(usersRepository);
    
    return authUseCase;
}