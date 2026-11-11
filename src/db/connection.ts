import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | undefined;

export const getPrismaClient = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to PostgreSQL");
  }

  if (!prisma) {
    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
  }
  return prisma;
};

export const connectDB = async (): Promise<void> => {
  await getPrismaClient().$connect();
  console.log("PostgreSQL connected");
};