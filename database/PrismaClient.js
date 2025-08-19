import { PrismaClient } from "@prisma/client";

export const PrismaClient = new PrismaClient({log: ["query", "error"]});