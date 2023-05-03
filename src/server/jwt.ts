import jwt from "jsonwebtoken";
import { exit } from "process";
import APIError from "./model/APIError";

export type JWTPayload = { username: string };

const secret = process.env.JWT_SECRET;
if (!secret) {
  // eslint-disable-next-line no-console
  console.error("JWT_SECRET not found");
  exit(1);
}

const options: jwt.SignOptions = {
  expiresIn: process.env.JWT_EXPIRES_IN || "10s"
};

export default {
  sign(payload: JWTPayload): string {
    return jwt.sign(payload, secret, options);
  },

  verify(token: string): JWTPayload {
    try {
      const payload = jwt.verify(token, secret) as JWTPayload;
      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw new APIError("Token expired", { cause: "token", statusCode: 403 });

      throw new APIError("Invalid token", { cause: "token", statusCode: 401 });
    }
  },

  expiresIn: Number(options.expiresIn?.toString().replace(/[^0-9]/g, "") || 10)
};
