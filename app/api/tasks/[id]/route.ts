import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const taskId = params.id; // Теперь id строковый (CUID)
        const body = await req.json();

        const isCompleted = body.completed;

        // Обновляем запись только если она принадлежит текущему пользователю
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
                userId: session.user.id, // Безопасность: чужую задачу изменить нельзя
            },
            data: {
                completed: isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : null,
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("PATCH ERROR:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
    }
}
