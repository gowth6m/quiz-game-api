import jwt from "jsonwebtoken";

export default class JWT {
    static sign(payload: string | object | Buffer, secret: string, options?: jwt.SignOptions): string {
        return jwt.sign(payload, secret, options);
    }

    static verify(token: string, secret: string, options?: jwt.VerifyOptions): string | object {
        return jwt.verify(token, secret, options);
    }
}
