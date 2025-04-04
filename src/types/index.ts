
export type DecodedToken = {
    id: string;
    username: string;
    iat: number;
    exp: number;
}

export type CreateCompletedLevelPayload = {
    score: number;
    level: number;
    timeTaken: number;
    attemptNumber?: number;
}