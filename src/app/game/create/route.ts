import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { Auth } from "@/utils/auth";

export async function POST(req: Request) {
    try {
        const user = await Auth.getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newGame = await prisma.game.create({
            data: {
                userId: user.id,
            },
        });

        return NextResponse.json({
            message: "Game created successfully",
            game: newGame,
        });
    } catch (error) {
        console.error("Game creation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
