import prisma from "@/prisma";
import { Auth } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const user = await Auth.getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const latestGame = await prisma.game.findFirst({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                completedLevels: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!latestGame) {
            return NextResponse.json({ error: "No games found for user" }, { status: 404 });
        }

        return NextResponse.json({ game: latestGame }, { status: 200 });
    } catch (error) {
        console.error("Error fetching latest game:", error);
        return NextResponse.json(
            {
                message: "Error",
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 },
        );
    }
}
