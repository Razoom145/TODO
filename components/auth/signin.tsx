"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignIn() {
    const tCommon = useTranslations("common");
    const tAuth = useTranslations("auth");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/dashboard",
            });

            if (res?.error) {
                setError(tAuth("invalidCredentials"));
            } else if (res?.url) {
                router.push(res.url);
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            setError(tAuth("unexpectedError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"flex justify-center flex-col items-center"}>
            <form onSubmit={handleSubmit} id="sign_in" className={"relative z-10 flex flex-col gap-6 w-[340px] text-left"}>
                <p className="text-4xl font-black text-[#6b4b35] mb-3 rotate-[1deg] tracking-wide">{tAuth("welcomeBack")}</p>

                {error && (
                    <p className="text-red-500 font-medium text-sm transition-all duration-200">
                        {error}
                    </p>
                )}

                <input
                    className="bg-[#fff9eb]/70 border-b-2 border-[#8b5e3c]/60 outline-none py-3 px-2 rounded-t-xl placeholder:text-[#7a6a58]/70 text-[#4b3425] shadow-sm transition-all duration-300 focus:scale-[1.02] focus:bg-[#fff8e7]"
                    name="email"
                    type="email"
                    placeholder={tAuth("email")}
                    required
                />
                <input
                    className="bg-[#fff9eb]/70 border-b-2 border-[#8b5e3c]/60 outline-none py-3 px-2 rounded-t-xl placeholder:text-[#7a6a58]/70 text-[#4b3425] shadow-sm transition-all duration-300 focus:scale-[1.02] focus:bg-[#fff8e7]"
                    name="password"
                    type="password"
                    placeholder={tAuth("password")}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 border-2 border-[#8b5e3c] bg-[#fff8e7] rounded-full w-32 py-3 shadow-lg rotate-[-1deg] hover:scale-105 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 text-[#4b3425] font-semibold"
                >
                    {loading ? tCommon("loading") : tCommon("submit")}
                </button>
            </form>
        </div>
    );
}