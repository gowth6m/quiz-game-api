import { NextResponse } from "next/server";
import prisma from "@/prisma";
import Password from "@/utils/password";
import { Auth } from "@/utils/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username: username.toLowerCase() },
        });
        if (existingUser) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 });
        }

        const hashedPassword = await Password.hash(password);
        const user = await prisma.user.create({ data: { username: username.toLowerCase(), password: hashedPassword } });

        return NextResponse.json({
            message: "User created successfully",
            user: Auth.safeUser(user),
        });
    } catch (error) {
        console.error("User creation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
