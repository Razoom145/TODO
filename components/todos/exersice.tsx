"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/app/dashboard/page";

type ExerciseProps = {
    tasks: Task[];
    onToggle: (task: Task) => void;
};

export default function Exercise({ tasks, onToggle }: ExerciseProps) {
    const toggleTask = async (task: Task) => {
        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    completed: !task.completed,
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
            <p className="text-center text-[#7a5a43] italic pt-10">
                Задачи отсутствуют. Нажмите "+ add", чтобы создать новую! 🐾
            </p>
        );
    }

    return (
        <div className="space-y-5">
            <AnimatePresence initial={false}>
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="flex items-start gap-5 hover:translate-x-2 transition-all duration-300"
                    >
                        {/* checkbox */}
                        <div
                            onClick={() => toggleTask(task)}
                            className={`min-w-6 h-6 border-2 border-[#8b5e3c] rounded-md mt-1 shadow-sm cursor-pointer transition-all flex items-center justify-center
                            ${
                                task.completed
                                    ? "bg-[#8b5e3c]"
                                    : "bg-[#fff9eb]"
                            }`}
                        >
                            {task.completed && (
                                <span className="text-[#fff9eb] text-sm">
                                    ✓
                                </span>
                            )}
                        </div>

                        {/* card */}
                        <div
                            className={`relative w-full rounded-[24px] border-2 shadow-md px-6 py-5 bg-[#fff8e7] border-[#8b5e3c]/30 transition-all ${
                                task.priority === "high"
                                    ? "rotate-[-1deg]"
                                    : task.priority === "medium"
                                        ? "rotate-[1deg]"
                                        : "rotate-[-2deg]"
                            }`}
                        >
                            {/* priority */}
                            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-bold bg-[#8b5e3c] text-[#f7f0dc] shadow-sm">
                                {task.priority}
                            </div>

                            <div className="space-y-3">
                                {/* title */}
                                <h2
                                    className={`text-2xl font-black text-[#5f3b24] break-words pr-16 ${
                                        task.completed
                                            ? "line-through opacity-40"
                                            : ""
                                    }`}
                                >
                                    {task.title}
                                </h2>

                                {/* details */}
                                {task.details && (
                                    <p
                                        className={`text-[#7a5a43] leading-relaxed break-words whitespace-pre-wrap ${
                                            task.completed
                                                ? "opacity-40"
                                                : ""
                                        }`}
                                    >
                                        {task.details}
                                    </p>
                                )}

                                {/* time */}
                                {(task.timeStart || task.timeEnd) && (
                                    <div className="flex items-center gap-3 text-sm text-[#7a5a43]/80 pt-2">
                                        <span>⏰ {task.timeStart || "--:--"}</span>
                                        <span>→</span>
                                        <span>{task.timeEnd || "--:--"}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
