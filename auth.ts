import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    // Включаем JWT стратегию, так как Credentials работает только с ней
    session: {
        strategy: "jwt",
    },
    providers: [
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Введите email и пароль");
                }

                // Ищем пользователя в базе данных
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                // Если пользователя нет или у него нет пароля (зарегистрирован через OAuth)
                if (!user || !user.password) {
                    throw new Error("Пользователь не найден или вошел через соцсети");
                }

                // Проверяем корректность пароля
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Неверный пароль");
                }

                // Возвращаем объект пользователя для сессии
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image
                };
            }
        })
    ],
    callbacks: {
        // Передаем id из базы в JWT токен
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // Передаем id из JWT токена в сессию на фронтенд
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

