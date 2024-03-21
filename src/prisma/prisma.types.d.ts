import { PrismaClient } from "@prisma/client";

export interface PrismaServiceProps {
    public prisma: PrismaClient
}