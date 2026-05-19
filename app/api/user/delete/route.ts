import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        // Проверяем авторизацию
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // 1. Сначала удаляем все задачи пользователя (на случай, если нет Cascade в схеме)
        await prisma.task.deleteMany({
            where: { userId }
        });

        // 2. Удаляем самого пользователя
        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE ACCOUNT ERROR:", error);
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}