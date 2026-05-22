"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function SignUp() {
    const tCommon = useTranslations("common");
    const tAuth = useTranslations("auth");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmpassword") as string;
        const username = formData.get("username") as string;

        if (password !== confirmPassword) {
            setError(tAuth("passwordMismatch"));
            return;
        }

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username })
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || tAuth("unexpectedError"));
            return;
        }

        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/dashboard",
        });
    };

    return (
        <div className={"flex justify-center flex-col items-center w-full px-1 sm:px-4"}>
            <form onSubmit={handleSubmit} id="sign_up" className={"flex flex-col gap-5 sm:gap-6 w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] text-left"}>
                <p className="text-3xl sm:text-4xl lg:text-5xl text-[#6b4b35] mb-2 sm:mb-3 rotate-[-1deg] leading-tight font-black">{tAuth("createAccount")}</p>
                {error && <p className="text-red-500 font-medium text-sm">{error}</p>}

                <input className="bg-[#fff9eb]/70 border-b-2 border-[#8b5e3c]/60 outline-none py-3 sm:py-3.5 px-3 rounded-t-xl placeholder:text-[#7a6a58]/70 text-[#4b3425] shadow-sm transition-all duration-300 sm:focus:scale-[1.02] focus:bg-[#fff8e7] text-base w-full" name="username" type="text" placeholder={tAuth("username")} required />
                <input className="bg-[#fff9eb]/70 border-b-2 border-[#8b5e3c]/60 outline-none py-3 sm:py-3.5 px-3 rounded-t-xl placeholder:text-[#7a6a58]/70 text-[#4b3425] shadow-sm transition-all duration-300 sm:focus:scale-[1.02] focus:bg-[#fff8e7] text-base w-full" name="email" type="email" placeholder={tAuth("email")} required />
                <input className="bg-[#fff9eb]/70 border-b-2 border-[#8b5e3c]/60 outline-none py-3 sm:py-3.5 px-3 rounded-t-xl placeholder:text-[#7a6a58]/70 text-[#4b3425] shadow-sm transition-all duration-300 sm:focus:scale-[1.02] focus:bg-[#fff8e7] text-base w-full" name="password" type="password" placeholder={tAuth("password")} required />
                <input className="bg-[#fff9eb]/70 border-b-2 border-[#8b5e3c]/60 outline-none py-3 sm:py-3.5 px-3 rounded-t-xl placeholder:text-[#7a6a58]/70 text-[#4b3425] shadow-sm transition-all duration-300 sm:focus:scale-[1.02] focus:bg-[#fff8e7] text-base w-full" name="confirmpassword" type="password" placeholder={tAuth("confirmPassword")} required />

                <button type="submit" className="mt-4 border-2 border-[#8b5e3c] bg-[#f7f0dc] rounded-full w-32 sm:w-36 py-3 shadow-md rotate-[1deg] sm:hover:scale-105 transition-all duration-300 text-base font-semibold self-center sm:self-start">
                    {tCommon("submit")}
                </button>
            </form>
        </div>
    );
}