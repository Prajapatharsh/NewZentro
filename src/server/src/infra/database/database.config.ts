import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await prisma.$connect();
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ Database connection error details:", error);
    throw error; // Rethrow to let createApp handle it
  }
};

export default prisma;
