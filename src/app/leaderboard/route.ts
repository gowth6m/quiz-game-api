import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get all users with their latest game
        const usersWithGames = await prisma.user.findMany({
            include: {
                games: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        // Filter out users with no games
        const leaderboard = usersWithGames
            .filter((user) => user.games.length > 0)
            .map((user) => {
                const latestGame = user.games[0];
                return {
                    username: user.username,
                    gameId: latestGame.id,
                    totalScore: latestGame.totalScore,
                    totalTimeTaken: latestGame.totalTimeTaken,
                    createdAt: latestGame.createdAt,
                };
            })
            .sort((a, b) => {
                if (b.totalScore === a.totalScore) {
                    return a.totalTimeTaken - b.totalTimeTaken;
                }
                return b.totalScore - a.totalScore;
            });

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            {
                message: "Error",
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
