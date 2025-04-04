import prisma from "@/prisma";
import { Auth } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ gameId: string }> }
) {
    try {
        const user = await Auth.getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { gameId } = await params;
        const body = await request.json();

        const { score, level, timeTaken, attemptNumber } = body;

        if (!score || !level || !timeTaken) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const completedLevel = await prisma.completedLevel.create({
            data: {
                gameId,
                userId: user.id,
                score,
                level,
                timeTaken,
                attemptNumber: attemptNumber ?? 1,
            },
        });

        await prisma.game.update({
            where: { id: gameId },
            data: {
                totalScore: {
                    increment: score,
                },
            },
        });

        return NextResponse.json(
            {
                message: "Completed level created successfully",
                completedLevel,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json(
            {
                message: "Error",
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
