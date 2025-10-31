import { Prisma, type User } from "@prisma/client";

import type { UsersRepository } from "../users-repository.js";
import { prisma } from "lib/prisma.js";

// Aqui é que realmente acessa o banco

export class PrismaUsersRepository implements UsersRepository {
<<<<<<< HEAD
  findById(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
=======
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
>>>>>>> dev
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}
