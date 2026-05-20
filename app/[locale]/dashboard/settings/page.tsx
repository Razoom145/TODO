"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

type TabType = "general" | "security" | "integrations";

export default function SettingsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const tCommon = useTranslations("common");
    const tSettings = useTranslations("settings");
    const tIntegrations = useTranslations("integrations");
    const tAuth = useTranslations("auth");

    const [activeTab, setActiveTab] = useState<TabType>("security");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleLanguageChange = (nextLocale: "ru" | "en") => {
        router.replace(pathname, { locale: nextLocale });
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordStatus(null);

        if (newPassword !== confirmPassword) {
            setPasswordStatus({ type: "error", text: tAuth("passwordMismatch") });
            return;
        }

        try {
            const res = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setPasswordStatus({ type: "error", text: data.error || tAuth("unexpectedError") });
            } else {
                setPasswordStatus({ type: "success", text: tSettings("passwordUpdated") });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            setPasswordStatus({ type: "error", text: tAuth("connectionError") });
        }
    };

    return (
        /* Внешний фон: винтажный глубокий крафт с текстурной микро-сеткой */
        <div className="min-h-screen w-full bg-[#dfd3b6] bg-[radial-gradient(#c4b493_1px,transparent_1px)] [background-size:16px_16px] py-12 px-4">
            <div className="max-w-4xl mx-auto p-6 text-[#5f3b24]">
                {/* Заголовок + Кнопка назад */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="group flex items-center gap-2 bg-[#f7f0dc] border-2 border-dashed border-[#8b5e3c] hover:border-[#5f3b24] px-5 py-3 rounded-2xl font-bold text-[#5f3b24] transition-all duration-300 hover:scale-105 active:scale-95 hover:rotate-[-3deg] shadow-md"
                    >
                        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                        {tCommon("back")} / Dashboard
                    </button>

                    <div className="inline-block bg-[#fff5da] border-2 border-dashed border-[#8b5e3c] rounded-2xl px-6 py-3 shadow-md rotate-[-1deg]">
                        <h1 className="text-3xl font-black tracking-wide text-[#5f3b24]">⚙️ {tSettings("profileSettings")}</h1>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 bg-[#f7f0dc] p-8 rounded-[32px] border-[3px] border-[#8b5e3c] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        {Array.from({ length: 15 }).map((_, idx) => (
                            <div key={idx} className="h-[46px] border-b border-[#7da1d1]/40"></div>
                        ))}
                    </div>

                    {/* Боковое меню табов */}
                    <nav className="relative z-10 flex md:flex-col gap-3 w-full md:w-52 border-b md:border-b-0 md:border-r-2 md:border-dashed border-[#8b5e3c]/30 pb-4 md:pb-0 md:pr-4">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`px-4 py-2.5 text-left rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${
                                activeTab === "general"
                                    ? "bg-[#8b5e3c] text-[#f7f0dc] rotate-[-2deg] scale-105"
                                    : "bg-[#fff5da] text-[#7a5a43] hover:bg-[#e8d6b6] rotate-[1deg]"
                            }`}
                        >
                            🌐 {tSettings("general")} ({tCommon("language")})
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`px-4 py-2.5 text-left rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${
                                activeTab === "security"
                                    ? "bg-[#8b5e3c] text-[#f7f0dc] rotate-[2deg] scale-105"
                                    : "bg-[#fff5da] text-[#7a5a43] hover:bg-[#e8d6b6] rotate-[-1deg]"
                            }`}
                        >
                            🔒 {tSettings("security")}
                        </button>
                        <button
                            onClick={() => setActiveTab("integrations")}
                            className={`px-4 py-2.5 text-left rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${
                                activeTab === "integrations"
                                    ? "bg-[#8b5e3c] text-[#f7f0dc] rotate-[-1deg] scale-105"
                                    : "bg-[#fff5da] text-[#7a5a43] hover:bg-[#e8d6b6] rotate-[2deg]"
                            }`}
                        >
                            🔌 {tSettings("integrations")}
                        </button>
                    </nav>

                    {/* Контент табов */}
                    <div className="relative z-10 flex-1 min-h-[300px] pl-2">
                        {/* ОБЩИЕ НАСТРОЙКИ (ЯЗЫК) */}
                        {activeTab === "general" && (
                            <div className="space-y-4 animate-fade-in rotate-[0.5deg]">
                                <h2 className="text-xl font-black text-[#5f3b24]">{tSettings("languageInterface")}</h2>
                                <p className="text-[#7a5a43] text-sm font-medium">{tSettings("chooseLanguage")}</p>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => handleLanguageChange("ru")}
                                        className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold shadow-sm transition-transform hover:scale-105 ${
                                            locale === "ru"
                                                ? "border-[#8b5e3c] bg-[#fff5da] text-[#5f3b24] rotate-[-2deg]"
                                                : "border-[#8b5e3c]/40 bg-[#fffdf7]/60 text-[#7a5a43]"
                                        }`}
                                    >
                                        🇷🇺 Русский
                                    </button>
                                    <button
                                        onClick={() => handleLanguageChange("en")}
                                        className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold shadow-sm transition-transform hover:scale-105 ${
                                            locale === "en"
                                                ? "border-[#8b5e3c] bg-[#fff5da] text-[#5f3b24] rotate-[2deg]"
                                                : "border-[#8b5e3c]/40 bg-[#fffdf7]/60 text-[#7a5a43]"
                                        }`}
                                    >
                                        🇺🇸 English
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* БЕЗОПАСНОСТЬ (СМЕНА ПАРОЛЯ) */}
                        {activeTab === "security" && (
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md animate-fade-in rotate-[-0.5deg]">
                                <h2 className="text-xl font-black text-[#5f3b24]">{tSettings("changePassword")}</h2>
                                {passwordStatus && (
                                    <div className={`p-3 rounded-xl text-sm border-2 font-bold shadow-sm ${
                                        passwordStatus.type === "success" ? "bg-green-100 border-green-700 text-green-800 rotate-[1deg]" : "bg-red-100 border-red-700 text-red-800 rotate-[-1deg]"
                                    }`}>
                                        {passwordStatus.text}
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#7a5a43] font-bold pl-1">{tSettings("currentPassword")}</label>
                                    <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-[#fffdf7] border-2 border-[#8b5e3c]/40 rounded-xl px-4 py-2.5 text-sm text-[#5f3b24] outline-none focus:border-[#8b5e3c] transition-colors shadow-sm" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#7a5a43] font-bold pl-1">{tSettings("newPassword")}</label>
                                    <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-[#fffdf7] border-2 border-[#8b5e3c]/40 rounded-xl px-4 py-2.5 text-sm text-[#5f3b24] outline-none focus:border-[#8b5e3c] transition-colors shadow-sm" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#7a5a43] font-bold pl-1">{tSettings("confirmNewPassword")}</label>
                                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-[#fffdf7] border-2 border-[#8b5e3c]/40 rounded-xl px-4 py-2.5 text-sm text-[#5f3b24] outline-none focus:border-[#8b5e3c] transition-colors shadow-sm" />
                                </div>
                                <button type="submit" className="bg-[#8b5e3c] border-2 border-[#6d4427] hover:scale-105 text-[#f7f0dc] font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md rotate-[1deg] mt-2">
                                    {tCommon("update")}
                                </button>
                            </form>
                        )}

                        {/* ИНТЕГРАЦИИ (TELEGRAM И OAUTH) */}
                        {activeTab === "integrations" && (
                            <div className="space-y-6 animate-fade-in rotate-[0.5deg]">
                                <div className="p-5 border-2 border-dashed border-[#8b5e3c]/60 bg-[#fff5da]/80 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm rotate-[-1deg]">
                                    <div>
                                        <h3 className="text-base font-black text-[#5f3b24] flex items-center gap-2">
                                            🤖 {tIntegrations("telegramBot")}
                                        </h3>
                                        <p className="text-xs text-[#7a5a43] font-medium mt-1">
                                            {tIntegrations("telegramDescription")}
                                        </p>
                                    </div>
                                    <button className="bg-sky-600 border-2 border-sky-700 hover:scale-105 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md whitespace-nowrap self-start sm:self-center rotate-[2deg]">
                                        {tIntegrations("connectBot")}
                                    </button>
                                </div>

                                <div className="rotate-[1deg]">
                                    <h3 className="text-lg font-black text-[#5f3b24] mb-3 pl-1">{tSettings("linkedAccounts")}</h3>
                                    <div className="space-y-3">
                                        <div className="p-4 border-2 border-[#8b5e3c]/40 bg-[#fffdf7]/70 rounded-2xl flex justify-between items-center shadow-sm">
                                            <span className="text-sm font-bold flex items-center gap-2 text-[#5f3b24]">🌐 {tIntegrations("googleAccount")}</span>
                                            <span className="text-xs bg-[#e8d6b6] text-[#7a5a43] font-bold px-2.5 py-1 rounded-lg border border-[#8b5e3c]/20">{tCommon("notConnected")}</span>
                                        </div>
                                        <div className="p-4 border-2 border-[#8b5e3c]/40 bg-[#fffdf7]/70 rounded-2xl flex justify-between items-center shadow-sm">
                                            <span className="text-sm font-bold flex items-center gap-2 text-[#5f3b24]">🐱 {tIntegrations("githubAccount")}</span>
                                            <span className="text-xs bg-green-100 text-green-800 border-2 border-green-700/30 font-bold px-2.5 py-1 rounded-lg">{tCommon("connected")}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}