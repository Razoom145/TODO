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
        <div className={"flex justify-center flex-col items-center"}>
            <form onSubmit={handleSubmit} id="sign_up" className={"flex flex-col gap-5 w-[320px] text-left"}>
                <p className="text-4xl text-[#6b4b35] mb-2 rotate-[-1deg]">{tAuth("createAccount")}</p>
                {error && <p className="text-red-500 font-medium text-sm">{error}</p>}

                <input className="bg-transparent border-b-2 border-[#8b5e3c] outline-none py-2 placeholder:text-[#7a6a58] text-[#4b3425]" name="username" type="text" placeholder={tAuth("username")} required />
                <input className="bg-transparent border-b-2 border-[#8b5e3c] outline-none py-2 placeholder:text-[#7a6a58] text-[#4b3425]" name="email" type="email" placeholder={tAuth("email")} required />
                <input className="bg-transparent border-b-2 border-[#8b5e3c] outline-none py-2 placeholder:text-[#7a6a58] text-[#4b3425]" name="password" type="password" placeholder={tAuth("password")} required />
                <input className="bg-transparent border-b-2 border-[#8b5e3c] outline-none py-2 placeholder:text-[#7a6a58] text-[#4b3425]" name="confirmpassword" type="password" placeholder={tAuth("confirmPassword")} required />

                <button type="submit" className="mt-4 border-2 border-[#8b5e3c] bg-[#f7f0dc] rounded-full w-28 py-2 shadow-md rotate-[1deg] hover:scale-105 transition-all duration-300">
                    {tCommon("submit")}
                </button>
            </form>
        </div>
    );
}