"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ADD from "@/components/modals/todo_add";
import Exercise from "@/components/todos/exersice";
import UserMenu from "@/components/UserMenu";
import { useTranslations } from "next-intl";
import useSWR from "swr";

export type Task = {
    id: string;
    title: string;
    details: string;
    priority: "low" | "medium" | "high";
    timeStart: string;
    timeEnd: string;
    done: boolean;
    completedAt?: string;
    deleteAt?: string;
    updatedAt: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
    const tDashboard = useTranslations("dashboard");
    const tCommon = useTranslations("common");
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // 1. ПОДКЛЮЧАЕМ SWR (Это твой единственный источник данных для задач)
    const { data: tasksData, mutate } = useSWR<Task[]>("/api/tasks", fetcher, {
        revalidateOnFocus: false,     // Не прыгать, когда юзер переключает вкладки
        revalidateIfStale: false,     // Блокируем показ старого кэша при монтировании
        dedupingInterval: 1000,       // Защита от спама запросами
    });

    // Безопасно вытаскиваем массив тасок
    const tasks = Array.isArray(tasksData) ? tasksData : [];

    // 2. СЛУШАЕМ ОБНОВЛЕНИЯ ЧЕРЕЗ MUTATE
    // Этот эффект нужен для кастомного события "tasksUpdated", которое генерирует твоя модалка
    useEffect(() => {
        const handler = () => mutate(); // SWR сам перезапросит свежие данные без мигания
        window.addEventListener("tasksUpdated", handler);
        return () => window.removeEventListener("tasksUpdated", handler);
    }, [mutate]);

    // 3. ТАЙМЕРЫ УДАЛЕНИЯ ВЫПОЛНЕННЫХ ЗАДАЧ
    // Оставляем твою логику исчезновения задач через минуту после выполнения
    // 3. ТАЙМЕРЫ УДАЛЕНИЯ ВЫПОЛНЕННЫХ ЗАДАЧ (Теперь с реальным удалением из БД)
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        const now = Date.now();
        const halfHourMs = 1 * 60 * 1000; // 1 минута

        tasks.forEach(t => {
            if (t.done && t.completedAt) {
                const completedTime = new Date(t.completedAt).getTime();
                const elapsed = now - completedTime;
                const remainingTime = halfHourMs - elapsed;

                const deleteTasksAfterTimeout = async (taskId: string) => {
                    try {
                        // 1. Отправляем запрос на реальное удаление в твой API
                        // Внимание: проверь свой роут удаления, обычно это DELETE /api/tasks?id=... или POST /api/tasks/delete
                        await fetch(`/api/tasks?id=${taskId}`, { method: "DELETE" });

                        // 2. Локально убираем из кэша SWR, чтобы экран обновился
                        mutate(prev => prev ? prev.filter(x => x.id !== taskId) : [], false);
                    } catch (err) {
                        console.error("Ошибка при автоматическом удалении задачи:", err);
                    }
                };

                if (remainingTime > 0) {
                    const timer = setTimeout(() => {
                        deleteTasksAfterTimeout(t.id);
                    }, remainingTime);
                    timers.push(timer);
                } else {
                    // Если время уже вышло, пока юзер гулял по настройкам — удаляем сразу
                    deleteTasksAfterTimeout(t.id);
                }
            }
        });

        return () => timers.forEach(clearTimeout);
    }, [tasks, mutate]);

    // Сортировка задач
    const priorityWeight = { high: 0, medium: 1, low: 2 } as const;
    const sortTasks = (list: Task[]) => {
        return [...list].sort((a, b) => {
            if (a.done !== b.done) return Number(a.done) - Number(b.done);
            const weightA = priorityWeight[a.priority as keyof typeof priorityWeight] ?? 99;
            const weightB = priorityWeight[b.priority as keyof typeof priorityWeight] ?? 99;
            if (weightA !== weightB) return weightA - weightB;
            return a.id.localeCompare(b.id);
        });
    };

    // Оптимистичное обновление чекбокса
    const handleToggle = (updatedTask: Task) => {
        mutate(prev => prev ? prev.map(t => (t.id === updatedTask.id ? updatedTask : t)) : [], false);
    };

    const sortedTasks = sortTasks(tasks);

    // Защита роутера для авторизации
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#d9c7a3] flex items-center justify-center text-[#5f3b24] font-bold text-2xl">
                {tCommon("loading")}
            </div>
        );
    }

    if (!session) return null;

    return (
        <main className="min-h-screen bg-[#d9c7a3] relative overflow-hidden px-8 py-10 font-sans">
            <div className="absolute top-10 left-10 rotate-[-12deg] text-5xl opacity-20 select-none">✦</div>
            <div className="absolute bottom-20 right-20 rotate-[8deg] text-6xl opacity-20 select-none">✎</div>
            <div className="absolute top-1/3 right-10 rotate-[20deg] text-4xl opacity-20 select-none">📎</div>

            <header className="max-w-[1200px] mx-auto flex flex-row justify-between items-center mb-10">
                <div className="bg-[#f7f0dc] border-2 border-[#8b5e3c] border-dashed px-6 py-3 rounded-2xl shadow-lg rotate-[-2deg]">
                    <p className="text-2xl font-black tracking-wide text-[#5f3b24]">🐾 Luck to do</p>
                </div>

                <div className="relative bg-[#f7f0dc] border-2 border-[#8b5e3c] border-dashed rounded-2xl px-5 py-3 shadow-lg rotate-[2deg] flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#c49a6c] flex items-center justify-center text-xl border-2 border-[#8b5e3c]">🐱</div>
                    <div>
                        <p className="text-sm text-[#7a5a43]">{tDashboard("loggedAs")}</p>
                        <p className="font-bold text-[#5f3b24]">{session?.user?.name || "User"}</p>
                    </div>
                    <button
                        className="bg-[#8b5e3c] text-[#f7f0dc] font-bold px-4 py-2 rounded-xl rotate-[-3deg] hover:scale-105 transition-all duration-300 shadow-md border-2 border-[#6d4427]"
                        onClick={() => setIsOpen(true)}
                    >
                        + {tDashboard("addTask")}
                    </button>
                </div>
            </header>

            <section className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8 items-start justify-center">
                <div className="relative bg-[#f7f0dc] w-full max-w-[850px] min-h-[650px] rounded-3xl shadow-2xl border-[3px] border-[#8b5e3c] overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                        {Array.from({ length: 22 }).map((_, idx) => (
                            <div key={idx} className="h-[42px] border-b border-[#7da1d1]/40"></div>
                        ))}
                    </div>
                    <div className="absolute left-20 top-0 w-[2px] h-full bg-red-400/50"></div>
                    <div className="absolute -top-4 left-10 w-28 h-8 bg-[#d8c29d]/70 rotate-[-8deg]"></div>
                    <div className="absolute -top-4 right-10 w-28 h-8 bg-[#d8c29d]/70 rotate-[8deg]"></div>

                    <div className="relative z-10 p-16">
                        <div className="mb-10 rotate-[-1deg] inline-block bg-[#fff5da] px-6 py-3 border-2 border-dashed border-[#8b5e3c] rounded-2xl shadow-md">
                            <p className="text-3xl font-black text-[#5f3b24] tracking-wide">✏️ {tDashboard("todayNotes").toUpperCase()}</p>
                        </div>

                        <div className="space-y-6 pl-14 text-[#5f3b24] text-xl relative z-10">
                            <div className="space-y-5 pt-2">
                                {/* Пока SWR не получил данные, мягко пишем статус */}
                                {!tasksData ? (
                                    <p className="text-sm italic text-[#7a5a43]">Загрузка ваших заметок...</p>
                                ) : (
                                    <Exercise tasks={sortedTasks} onToggle={handleToggle} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="sticky top-6 self-start">
                    <UserMenu />
                </aside>
            </section>

            {/* Передаем mutate как триггер обновления кэша */}
            <ADD isOpen={isOpen} onClose={() => setIsOpen(false)} onCreated={mutate} />
        </main>
    );
}