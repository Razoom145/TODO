"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from "next-intl";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
};

export default function ADD({ isOpen, onClose, onCreated }: ModalProps) {
    const tCommon = useTranslations("common");
    const tTask = useTranslations("task");

    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [priority, setPriority] = useState("medium");
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "title") setTitle(value);
        else if (name === "timeStart") setTimeStart(value);
        else if (name === "timeEnd") setTimeEnd(value);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (title.trim() === "") return;

        const newTask = {
            title,
            details,
            priority,
            timeStart,
            timeEnd
        };

        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask)
        });

        if (res.ok) {
            setTitle("");
            setDetails("");
            setPriority("medium");
            setTimeStart("");
            setTimeEnd("");

            onCreated();
            onClose();

            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("tasksUpdated"));
            }
        }
    }

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[650px] bg-[#f7f0dc] border-[3px] border-[#8b5e3c] rounded-[32px] shadow-2xl overflow-hidden rotate-[-1deg]">
                <div className="absolute -top-4 left-10 w-28 h-8 bg-[#d8c29d]/70 rotate-[-10deg]"></div>
                <div className="absolute -top-4 right-10 w-28 h-8 bg-[#d8c29d]/70 rotate-[8deg]"></div>

                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="h-[48px] border-b border-[#7da1d1]/40"></div>
                    ))}
                </div>

                <div className="absolute left-16 top-0 w-[2px] h-full bg-red-400/50"></div>

                <div className="relative z-10 p-12">
                    <div className="inline-block mb-10 bg-[#fff5da] border-2 border-dashed border-[#8b5e3c] rounded-2xl px-6 py-3 shadow-md rotate-[-2deg]">
                        <h1 className="text-3xl font-black tracking-wide text-[#5f3b24]">✏️ {tTask("newTodo").toUpperCase()}</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pl-10">
                        <div className="rotate-[-1deg]">
                            <p className="mb-2 text-[#7a5a43] font-semibold">📌 {tTask("title")}</p>
                            <input type="text" value={title} onChange={handleChange} name="title" placeholder={tTask("writeTask")} className="w-full bg-transparent border-b-2 border-[#8b5e3c]/50 outline-none py-2 text-[#5f3b24] placeholder:text-[#7a5a43]/50 font-medium text-lg" required />
                        </div>

                        <div className="rotate-[1deg]">
                            <p className="mb-2 text-[#7a5a43] font-semibold">📝 {tTask("details")}</p>
                            <textarea name="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder={tTask("littleNotes")} className="w-full min-h-[120px] resize-none bg-[#fff9eb]/60 border-2 border-dashed border-[#8b5e3c]/40 rounded-2xl p-4 outline-none text-[#5f3b24] placeholder:text-[#7a5a43]/50 font-medium" />
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-1 rotate-[-1deg]">
                                <p className="mb-2 text-[#7a5a43] font-semibold">⭐ {tTask("priority")}</p>
                                <select name="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-[#fff5da] border-2 border-[#8b5e3c]/40 rounded-xl px-4 py-3 outline-none text-[#5f3b24] font-bold shadow-sm">
                                    <option value="low">{tTask("low")}</option>
                                    <option value="medium">{tTask("medium")}</option>
                                    <option value="high">{tTask("high")}</option>
                                </select>
                            </div>

                            <div className="flex-1 rotate-[1deg]">
                                <p className="mb-2 text-[#7a5a43] font-semibold">⏰ {tTask("timeStart")}</p>
                                <input name="timeStart" value={timeStart} type="time" onChange={handleChange} className="w-full bg-[#fff5da] border-2 border-[#8b5e3c]/40 rounded-xl px-4 py-3 outline-none text-[#5f3b24] font-medium shadow-sm" />
                            </div>
                        </div>

                        <div className="rotate-[-1deg]">
                            <p className="mb-2 text-[#7a5a43] font-semibold">🌙 {tTask("timeEnd")}</p>
                            <input name="timeEnd" value={timeEnd} type="time" onChange={handleChange} className="w-full bg-[#fff5da] border-2 border-[#8b5e3c]/40 rounded-xl px-4 py-3 outline-none text-[#5f3b24] font-medium shadow-sm" />
                        </div>

                        <div className="flex justify-end gap-4 mt-12">
                            <button type="button" className="px-6 py-3 rounded-2xl bg-[#e8d6b6] border-2 border-[#8b5e3c]/40 text-[#5f3b24] font-bold rotate-[-2deg] hover:scale-105 transition-all duration-300 shadow-md" onClick={onClose}>
                                {tCommon("cancel")}
                            </button>
                            <button type="submit" className="px-8 py-3 rounded-2xl bg-[#8b5e3c] border-2 border-[#6d4427] text-[#f7f0dc] font-bold rotate-[2deg] hover:scale-105 transition-all duration-300 shadow-lg">
                                {tCommon("add")}
                            </button>
                        </div>
                    </form>

                    <div className="absolute bottom-6 left-8 text-2xl opacity-30 rotate-[-12deg]">✦</div>
                    <div className="absolute top-10 right-10 text-3xl opacity-30 rotate-[12deg]">📎</div>
                </div>
            </div>
        </div>
    );
}