import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Берем id из параметров строки: /api/tasks?id=123
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        // Удаляем задачу, только если она принадлежит текущему пользователю
        await prisma.task.deleteMany({
            where: {
                id: id,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("DELETE_TASK_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: [{ done: "asc" }, { createdAt: "desc" }]
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("GET TASKS ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title: body.title,
                details: body.details || "",
                priority: body.priority || "medium",
                timeStart: body.timeStart || "",
                timeEnd: body.timeEnd || "",
                userId: session.user.id,
            }
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error("POST TASK ERROR:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}