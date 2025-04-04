import { Auth } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const user = await Auth.getAuthenticatedUser(req);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user: Auth.safeUser(user) });
    } catch (error) {
        console.error("Current user error:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}