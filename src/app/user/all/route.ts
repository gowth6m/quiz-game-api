import prisma from "@/prisma";
import { Auth } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users.map(user => (Auth.safeUser(user))));

    } catch (error) {
        console.error("Error fetching users:", error);

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
