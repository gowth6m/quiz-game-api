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
        const completedLevels = await prisma.completedLevel.findMany({
            where: {
                gameId: gameId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ completedLevels }, { status: 200 });
    } catch (error) {
        console.error("Error fetching completed levels:", error);
        return NextResponse.json(
            { message: "Error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
