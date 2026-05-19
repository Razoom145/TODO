"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ADD from "@/components/modals/todo_add";
import Exercise from "@/components/todos/exersice";

export type Task = {
    id: string; // Строковый тип CUID из Prisma
    title: string;
    details: string;
    priority: "low" | "medium" | "high";
    timeStart: string;
    timeEnd: string;
    completed: boolean;
    completedAt?: string;
    deleteAt?: string;
};

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks");
            const data = await res.json();

            if (!res.ok) {
                console.error("API ERROR:", data);
                setTasks([]);
                return;
            }

            const sorted = sortTasks(Array.isArray(data) ? data : []);
            setTasks(sorted);
        } catch (error) {
            console.error("Fetch tasks failed:", error);
        }
    };

    const priorityWeight = {
        high: 0,
        medium: 1,
        low: 2,
    } as const;

    const sortTasks = (list: Task[]) => {
        return [...list].sort((a, b) => {
            if (a.completed !== b.completed) {
                return Number(a.completed) - Number(b.completed);
            }
            return (
                (priorityWeight[a.priority as keyof typeof priorityWeight] ?? 99) -
                (priorityWeight[b.priority as keyof typeof priorityWeight] ?? 99)
            );
        });
    };

    const handleToggle = (updatedTask: Task) => {
        setTasks(prev =>
            sortTasks(
                prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
            )
        );
    };

    // Загрузка данных при авторизации
    useEffect(() => {
        if (status === "authenticated") {
            fetchTasks();
        }
    }, [status]);

    // Подписка на событие добавления новых задач
    useEffect(() => {
        const handler = () => fetchTasks();
        window.addEventListener("tasksUpdated", handler);
        return () => window.removeEventListener("tasksUpdated", handler);
    }, []);

    // Умный таймер удаления выполненных задач (ровно через 30 минут после завершения)
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        tasks.forEach(t => {
            if (t.completed && t.completedAt) {
                const completedTime = new Date(t.completedAt).getTime();
                const elapsed = Date.now() - completedTime;
                const halfHourMs = 30 * 60 * 1000;
                const remainingTime = halfHourMs - elapsed;

                if (remainingTime > 0) {
                    const timer = setTimeout(() => {
                        setTasks(prev => prev.filter(x => x.id !== t.id));
                    }, remainingTime);
                    timers.push(timer);
                } else {
                    // Если 30 минут уже прошли на момент загрузки страницы, убираем из стейта
                    setTasks(prev => prev.filter(x => x.id !== t.id));
                }
            }
        });

        return () => timers.forEach(clearTimeout);
    }, [tasks]);

    // Редирект неавторизованных
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#d9c7a3] flex items-center justify-center text-[#5f3b24] font-bold text-2xl">
                Loading...
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
                    <p className="text-2xl font-black tracking-wide text-[#5f3b24]">
                        🐾 Luck to do
                    </p>
                </div>

                <div className="relative bg-[#f7f0dc] border-2 border-[#8b5e3c] border-dashed rounded-2xl px-5 py-3 shadow-lg rotate-[2deg] flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#c49a6c] flex items-center justify-center text-xl border-2 border-[#8b5e3c]">
                        🐱
                    </div>

                    <div>
                        <p className="text-sm text-[#7a5a43]">logged as</p>
                        <p className="font-bold text-[#5f3b24]">
                            {session?.user?.name || "User"}
                        </p>
                    </div>

                    <button
                        className="bg-[#8b5e3c] text-[#f7f0dc] px-4 py-2 rounded-xl rotate-[-3deg] hover:scale-105 transition-all duration-300 shadow-md"
                        onClick={() => setIsOpen(true)}
                    >
                        + add
                    </button>
                </div>
            </header>

            <section className="max-w-[1200px] mx-auto flex justify-center">
                <div className="relative bg-[#f7f0dc] w-[850px] min-h-[650px] rounded-3xl shadow-2xl border-[3px] border-[#8b5e3c] overflow-hidden">
                    {/* Линии тетради */}
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                        {Array.from({ length: 15 }).map((_, idx) => (
                            <div key={idx} className="h-[42px] border-b border-[#7da1d1]/40"></div>
                        ))}
                    </div>

                    <div className="absolute left-20 top-0 w-[2px] h-full bg-red-400/50"></div>

                    <div className="absolute -top-4 left-10 w-28 h-8 bg-[#d8c29d]/70 rotate-[-8deg]"></div>
                    <div className="absolute -top-4 right-10 w-28 h-8 bg-[#d8c29d]/70 rotate-[8deg]"></div>

                    <div className="relative z-10 p-16">
                        <div className="mb-10 rotate-[-1deg] inline-block bg-[#fff5da] px-6 py-3 border-2 border-dashed border-[#8b5e3c] rounded-2xl shadow-md">
                            <p className="text-3xl font-black text-[#5f3b24] tracking-wide">
                                ✏️ TODAY'S NOTES
                            </p>
                        </div>

                        <div className="space-y-6 pl-14 text-[#5f3b24] text-xl relative z-10">
                            {/* Отображаем динамические задачи из базы через компонент */}
                            <div className="space-y-5 pt-2">
                                <Exercise
                                    tasks={tasks}
                                    onToggle={handleToggle}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ADD isOpen={isOpen}
                 onClose={() => setIsOpen(false)}
                 onCreated={fetchTasks}
            />
        </main>
    );
}