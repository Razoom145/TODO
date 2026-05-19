import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Настраиваем WebSocket конструктор для Neon (критично для серверной среды Node.js)
if (typeof globalThis.WebSocket === "undefined" && typeof window === "undefined") {
    neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    let rawConnectionString = process.env.DATABASE_URL;

    if (!rawConnectionString) {
        throw new Error(
            "DATABASE_URL missing! Убедитесь, что переменная DATABASE_URL задана в файле .env " +
            "и сервер Next.js был полностью перезапущен после добавления."
        );
    }

    // Защита: удаляем любые внешние кавычки (одинарные или двойные), которые могли остаться из .env
    const connectionString = rawConnectionString.replace(/^["']|["']$/g, "");

    const adapter = new PrismaNeon({ connectionString });

    return new PrismaClient({
        adapter,
        log: ["error", "warn"],
    });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
