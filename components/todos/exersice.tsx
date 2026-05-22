"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/app/[locale]/dashboard/page";
import { useTranslations } from "next-intl";

type ExerciseProps = {
    tasks: Task[];
    onToggle: (task: Task) => void;
};

export default function Exercise({ tasks, onToggle }: ExerciseProps) {
    const tDashboard = useTranslations("dashboard");
    const tTask = useTranslations("task");

    const toggleTask = async (task: Task) => {
        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    completed: !task.done
                }),
            });

            if (!res.ok) {
                console.error("PATCH failed:", await res.text());
                return;
            }

            const updated: Task = await res.json();
            onToggle(updated);
        } catch (error) {
            console.error("Toggle task failed:", error);
        }
    };

    if (tasks.length === 0) {
        return (
            <p className="text-center text-[#7a5a43] italic pt-10 text-sm sm:text-base">
                {tDashboard("emptyTasks")}
            </p>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <AnimatePresence initial={false} mode="popLayout">
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        layoutId={`task-${task.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: -10
                        }}
                        transition={{
                            layout: { duration: 0.45, ease: "easeInOut" },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.25 },
                        }}
                        className="flex items-start gap-3 sm:gap-5 hover:translate-x-1 transition-all duration-300 relative"
                    >
                        {/* Checkbox */}
                        <div
                            onClick={() => toggleTask(task)}
                            className={`min-w-6 h-6 border-2 border-[#8b5e3c] rounded-md mt-1 sm:mt-1.5 cursor-pointer 
                                transition-all flex items-center justify-center select-none
                                ${task.done
                                ? "bg-[#8b5e3c]/20"
                                : "bg-transparent hover:bg-[#8b5e3c]/10"
                            }`}
                        >
                            {task.done && (
                                <span className="text-[#8b5e3c] font-black text-sm">✓</span>
                            )}
                        </div>

                        {/* Контент задачи */}
                        <div className="w-full min-w-0 space-y-1">
                            {/* Заголовок */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <h2
                                    className={`text-lg sm:text-xl md:text-2xl font-black text-[#5f3b24] break-words tracking-wide transition-all duration-300
                                        ${task.done
                                        ? "line-through opacity-40 decoration-[#8b5e3c] decoration-2"
                                        : ""
                                    }`}
                                >
                                    {task.title}
                                </h2>

                                <span
                                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md border border-dashed shrink-0 transition-colors
                                        ${task.priority === "high"
                                        ? "text-red-700 border-red-400 bg-red-50/40"
                                        : task.priority === "medium"
                                            ? "text-[#8b5e3c] border-[#8b5e3c]/40 bg-[#fff5da]/40"
                                            : "text-gray-500 border-gray-300"
                                    }`}
                                >
                                    {tTask(task.priority)}
                                </span>
                            </div>

                            {/* Детали */}
                            {task.details && (
                                <div className="max-h-24 overflow-auto pr-2 scrollbar-thin">
                                    <p
                                        className={`text-sm sm:text-base text-[#7a5a43] font-medium leading-relaxed break-words whitespace-pre-wrap max-w-2xl transition-all duration-300
                                            ${task.done ? "opacity-40" : ""}`}
                                    >
                                        {task.details}
                                    </p>
                                </div>
                            )}

                            {/* Время */}
                            {(task.timeStart || task.timeEnd) && (
                                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#7a5a43]/70 pt-0.5">
                                    <span>⏰ {task.timeStart || "--:--"}</span>
                                    <span>→</span>
                                    <span>{task.timeEnd || "--:--"}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}