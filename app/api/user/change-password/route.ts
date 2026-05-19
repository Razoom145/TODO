import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // 1. Проверяем авторизацию сессии
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
        }

        // 2. Ищем пользователя в базе через Призму
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Пользователь не найден или вошел через OAuth" }, { status: 404 });
        }

        // 3. Проверяем, совпадает ли старый введенный пароль с хэшем в базе
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 });
        }

        // 4. Хэшируем новый пароль перед сохранением
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // 5. Записываем новый хэш в Supabase
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return NextResponse.json({ message: "Пароль успешно обновлен" }, { status: 200 });
    } catch (error) {
        console.error("PASSWORD CHANGE API ERROR:", error);
        return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
    }
}