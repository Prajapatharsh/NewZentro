import { LogEntry } from "./logs.types";
import prisma from "@/infra/database/database.config";

export class LogsRepository {

  constructor() {
  }

  async getLogs() {

    return prisma.log.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });
  }

  async getLogById(id: string) {
    return prisma.log.findUnique({
      where: { id },
    });
  }
  async getLogsByLevel(level: string) {
    return prisma.log.findMany({
      where: { level },
    });
  }

  async deleteLog(id: string) {
    return prisma.log.delete({
      where: { id },
    });
  }

  async clearLogs() {
    return prisma.log.deleteMany();
  }

  async createLog(data: LogEntry) {
    try {
      return await prisma.log.create({
        data: {
          level: data.level,
          message: data.message,
          context: data.context,
        },
      });
    } catch (error) {
      console.error("Failed to save log to database:", error);
      // Don't throw the error, just return null so the app doesn't crash
      return null;
    }
  }
}
