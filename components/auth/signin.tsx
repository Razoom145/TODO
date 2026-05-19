export default function SignIn(){
    return (
        <div className={"flex justify-center"}>
            <form id="sign_in" className={"flex flex-col gap-5 w-[320px] text-left"}>
                <p className="text-4xl text-[#6b4b35] mb-2 rotate-[1deg]">Welcome back</p>
                <input className="bg-transparent border-b-2 border-[#8b5e3c] outline-none py-2 placeholder:text-[#7a6a58] text-[#4b3425]" name="email" type="email" placeholder="Email" />
                <input className="bg-transparent border-b-2 border-[#8b5e3c] outline-none py-2 placeholder:text-[#7a6a58] text-[#4b3425]" name="password" type="password" placeholder="Password" />
                <button type="submit" className="mt-4 border-2 border-[#8b5e3c] bg-[#f7f0dc] rounded-full w-28 py-2 shadow-md rotate-[-1deg] hover:scale-105 transition-all duration-300">
                    Submit
                </button>
            </form>
        </div>
    );
}
