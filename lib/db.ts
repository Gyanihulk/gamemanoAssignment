import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}
if (!globalThis.prisma) {
  // Declare prisma globally if it's not already
  globalThis.prisma = new PrismaClient();
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;