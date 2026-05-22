"use client";

import { signOut } from "next-auth/react";
import { Settings, LogOut, Trash2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";


export default function UserMenu() {
    const tCommon = useTranslations("common");
    const tMenu = useTranslations("menu");
    const tAlerts = useTranslations("alerts");

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(tAlerts("deleteAccountConfirm"));

        if (confirmed) {
            try {
                const res = await fetch("/api/user/delete", { method: "DELETE" });
                if (res.ok) {
                    signOut({ callbackUrl: "/" });
                } else {
                    alert(tAlerts("deleteAccountError"));
                }
            } catch (err) {
                console.error(err);
            }
        }
    };
    const locale = useLocale(); // вернет "ru" или "en"
    return (
        <div className="w-full max-w-[224px] sm:w-56 border-2 border-[#8b5e3c] border-dashed rounded-2xl bg-[#fffdf7] p-3 shadow-xl flex flex-col gap-1 rotate-[1deg]">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-[#5f3b24] font-medium hover:bg-[#f7f0dc] rounded-xl transition-colors w-full text-left">
                <Settings className="w-4 h-4 text-[#7a5a43]"/>
                <span>{tMenu("settings")}</span>
            </Link>

            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[#5f3b24] font-medium hover:bg-[#f7f0dc] rounded-xl transition-colors w-full text-left"
            >
                <LogOut className="w-4 h-4 text-[#7a5a43]" />
                <span>{tMenu("logout")}</span>
            </button>

            <div className="border-t-2 border-dashed border-[#8b5e3c]/20 my-2" />

            <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-3 px-3 py-2 text-sm text-red-700 font-bold hover:bg-red-50 rounded-xl transition-colors w-full text-left"
            >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>{tMenu("deleteAccount")}</span>
            </button>
        </div>
    );
}