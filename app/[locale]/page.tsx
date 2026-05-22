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
        /* Внешний фон: винтажный глубокий крафт с текстурной микро-сеткой */
        <div className="min-h-screen w-full bg-[#dfd3b6] bg-[radial-gradient(#c4b493_1px,transparent_1px)] [background-size:16px_16px] px-4 py-6 sm:py-10 lg:py-16 flex items-center justify-center overflow-x-hidden">
            <div className={"relative text-center bg-[#f2e8c9] border-[#8b5e3c] border-[3px] mx-auto pt-6 sm:pt-8 lg:pt-10 pb-28 sm:pb-20 lg:pb-10 px-4 sm:px-8 lg:px-12 w-full max-w-[420px] sm:max-w-[620px] lg:max-w-[760px] min-h-[620px] sm:min-h-[560px] lg:min-h-[520px] flex flex-col justify-start shadow-2xl rounded-xl overflow-hidden before:content-[''] before:absolute before:left-7 sm:before:left-12 lg:before:left-16 before:top-0 before:w-[2px] before:h-full before:bg-red-300"}>
                <div className={"grid grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-10 lg:mb-12 text-base sm:text-xl lg:text-2xl font-semibold text-[#6b4b35] z-10 items-center"}>
                    <button
                        onClick={() => setMode("sign_in")}
                        className={`transition-all duration-300 rotate-[-2deg] px-3 sm:px-5 py-2 sm:py-2.5 mx-auto min-w-[120px] sm:min-w-[150px] rounded-lg border-2 border-dashed border-[#8b5e3c] shadow-md text-center ${mode === "sign_in" ? "bg-[#f7f0dc] scale-105" : "bg-transparent opacity-70"}`}
                    >
                        {tAuth("signIn")}
                    </button>
                    <button
                        onClick={() => setMode("sign_up")}
                        className={`transition-all duration-300 rotate-[2deg] px-3 sm:px-5 py-2 sm:py-2.5 mx-auto min-w-[120px] sm:min-w-[150px] rounded-lg border-2 border-dashed border-[#8b5e3c] shadow-md text-center ${mode === "sign_up" ? "bg-[#f7f0dc] scale-105" : "bg-transparent opacity-70"}`}
                    >
                        {tAuth("signUp")}
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center mb-6 sm:mb-4 lg:mb-0">
                    {mode === "sign_in" && <SignIn />}
                    {mode === "sign_up" && <SignUp />}
                </div>

                {/* Ряд социальных кнопок, адаптивный под мобилки */}
                <div className="flex sm:contents flex-row justify-center items-center gap-5 sm:gap-0 mt-8 sm:mt-0">
                    <button
                        onClick={() => handleOAuth("github")}
                        className={"relative sm:absolute sm:top-8 lg:top-10 sm:right-6 lg:right-8 border-[#8b5e3c] bg-[#f7f0dc] border-2 border-dashed rounded-full w-14 h-14 sm:w-[68px] sm:h-[68px] p-3 shadow-lg rotate-[10deg] sm:hover:scale-110 transition-all duration-300 shrink-0"}
                        id={"github"}
                    >
                        <img src={"/GitHub_Invertocat_Logo.svg"} alt={"GitHub"} className="w-full h-full object-contain p-0" />
                    </button>

                    <button
                        onClick={() => handleOAuth("google")}
                        className={"relative sm:absolute sm:bottom-6 lg:bottom-8 sm:left-8 lg:left-10 border-[#8b5e3c] bg-[#f7f0dc] border-2 border-dashed rounded-full w-14 h-14 sm:w-[68px] sm:h-[68px] p-3 shadow-lg rotate-[8deg] sm:hover:scale-110 transition-all duration-300 shrink-0"}
                        id={"google"}
                    >
                        <img src={"/Google.svg"} alt={"Google"} className="w-full h-full object-contain p-0" />
                    </button>
                </div>
            </div>
        </div>
    );
}