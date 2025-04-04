import { DecodedToken } from "@/types";
import { ENV } from "./env";
import JWT from "./jwt";
import prisma from "@/prisma";
import { User } from "@prisma/client";

export class Auth {

    private static getUserFromToken(token: string): DecodedToken | null {
        try {
            const decoded = JWT.verify(token, ENV.JWT_SECRET) as DecodedToken;
            return decoded;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    }

    private static getUserFromHeader(req: Request): DecodedToken | null {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.warn("Missing or malformed Authorization header");
            return null;
        }

        const token = authHeader.split(" ")[1];
        return this.getUserFromToken(token);
    }

    static async getAuthenticatedUser(req: Request): Promise<User | null> {
        const decoded = this.getUserFromHeader(req);
        if (!decoded) {
            console.warn("User not authenticated (no or invalid token)");
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            console.warn("User not found in database");
            return null;
        }

        return user;
    }

    static safeUser(user: User): Omit<User, "password"> {
        return {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}