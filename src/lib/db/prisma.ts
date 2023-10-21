// This code just prevents a new prisma client from creating everytime we save a project and the server restarts. It sets up a new prisma client and makes it global. Only if it doesn't exist on global, does a new one get created.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
