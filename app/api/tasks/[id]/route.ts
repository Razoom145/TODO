import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }   // ← важно!
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;   // ← вот здесь await

        if (!id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
        }

        const { completed } = await request.json();

        const updatedTask = await prisma.task.update({
            where: {
                id: id,
                userId: session.user.id,
            },
            data: {
                done: Boolean(completed),
                completedAt: Boolean(completed) ? new Date() : null,   // ← добавь это
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error: any) {
        console.error("PATCH TASK ERROR:", error);
        return NextResponse.json(
            { error: "Failed to update task", details: error.message },
            { status: 500 }
        );
    }
}