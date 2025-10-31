import { Prisma, type CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "lib/prisma.js";
import type { CheckInsRepository } from "repositories/check-ins-repository.js";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  // Paginação de check-ins por usuário
  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }
  // Procurar check-in por ID
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }
  // Procurar check-in por usuário e data específica
    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf("date")
        const endOfTheDay = dayjs(date).endOf("date")

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                userId: userId,
                created_at: {
                    gte: startOfTheDay.toDate(),
                    lte: endOfTheDay.toDate(),
                }
            }
        })

        return checkIn;
    }

  // Definir o início e o fim do dia fornecido
  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        userId: userId,
      },
    });

    return count;
  }
  // Atualizar o check-in existente
  async save(checkIn: CheckIn) {
    const checkInUpdate = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    });

    return checkInUpdate;
  }
}
