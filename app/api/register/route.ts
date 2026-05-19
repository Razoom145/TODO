import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, password, username } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Не заполнены обязательные поля" },
                { status: 400 }
            );
        }

        // Проверяем, существует ли уже пользователь
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Пользователь с таким email уже существует" },
                { status: 400 }
            );
        }

        // Хэшируем пароль (соль = 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем пользователя в Supabase через Prisma
        const user = await prisma.user.create({
            data: {
                email,
                name: username || null,
                password: hashedPassword,
            }
        });

        return NextResponse.json(
            { message: "Пользователь успешно зарегистрирован", userId: user.id },
            { status: 201 }
        );

    } catch (error) {
        console.error("Ошибка регистрации:", error);
        return NextResponse.json(
            { error: "Внутренняя ошибка сервера" },
            { status: 500 }
        );
    }
}