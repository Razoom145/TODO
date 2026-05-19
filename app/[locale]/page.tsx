"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import SignIn from "@/components/auth/signin";
import SignUp from "@/components/auth/signup";
import { useTranslations } from "next-intl";

export default function Home() {
    const tAuth = useTranslations("auth");
    const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
    const [loading, setLoading] = useState(false);

    const handleOAuth = async (provider: "google" | "github") => {
        if (loading) return;

        try {
            setLoading(true);
            await signIn(provider, {
                callbackUrl: "/dashboard",
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"relative text-center bg-[#f2e8c9] mt-24 border-[#8b5e3c] border-[3px] mx-auto pt-10 pb-10 px-8 w-[700px] min-h-[500px] flex flex-col justify-start shadow-2xl rounded-md overflow-hidden before:content-[''] before:absolute before:left-14 before:top-0 before:w-[2px] before:h-full before:bg-red-300"}>
            <div className={"grid grid-cols-2 mb-12 text-2xl font-semibold text-[#6b4b35]"}>
                <button
                    onClick={() => setMode("sign_in")}
                    className={`transition-all duration-300 rotate-[-2deg] px-4 py-2 mx-auto w-fit rounded-md border-2 border-dashed border-[#8b5e3c] shadow-md ${mode === "sign_in" ? "bg-[#f7f0dc] scale-105" : "bg-transparent opacity-70"}`}
                >
                    {tAuth("signIn")}
                </button>
                <button
                    onClick={() => setMode("sign_up")}
                    className={`transition-all duration-300 rotate-[2deg] px-4 py-2 mx-auto w-fit rounded-md border-2 border-dashed border-[#8b5e3c] shadow-md ${mode === "sign_up" ? "bg-[#f7f0dc] scale-105" : "bg-transparent opacity-70"}`}
                >
                    {tAuth("signUp")}
                </button>
            </div>
            {mode === "sign_in" && <SignIn />}
            {mode === "sign_up" && <SignUp />}

            <button
                onClick={() => handleOAuth("github")}
                className={"absolute top-10 right-8 border-[#8b5e3c] bg-[#f7f0dc] border-2 border-dashed rounded-full w-16 h-16 p-3 shadow-lg rotate-[10deg] hover:scale-110 transition-all duration-300"}
                id={"github"}
            >
                <img
                    src={"/GitHub_Invertocat_Logo.svg"}
                    alt={"GitHub"}
                    className="w-full h-full object-contain p-0"
                />
            </button>

            <button
                onClick={() => handleOAuth("google")}
                className={"absolute bottom-8 left-10 border-[#8b5e3c] bg-[#f7f0dc] border-2 border-dashed rounded-full w-16 h-16 p-3 shadow-lg rotate-[8deg] hover:scale-110 transition-all duration-300"}
                id={"google"}
            >
                <img
                    src={"/Google.svg"}
                    alt={"Google"}
                    className="w-full h-full object-contain p-0"
                />
            </button>
        </div>
    );
}