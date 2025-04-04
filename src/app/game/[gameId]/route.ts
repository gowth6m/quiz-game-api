import prisma from "@/prisma";
import { Auth } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ gameId: string }> }
) {
    try {
        const user = await Auth.getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { gameId } = await params;

        const game = await prisma.game.findUnique({
            where: { id: gameId },
            include: {
                completedLevels: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        if (game.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json({ game }, { status: 200 });
    } catch (error) {
        console.error("Error fetching game:", error);
        return NextResponse.json(
            {
                message: "Error",
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
