/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from "jsonwebtoken";
import APIError from "../model/APIError";
import { jwtEnv } from "../../enviroment";

/**
 * Payload of a JWT token.
 * Contains the username of the user.
 */
export type JWTPayload = { username: string };

const options: jwt.SignOptions = {
  expiresIn: jwtEnv.expiresIn
};

/**
 * Internal function for generating JWT tokens.
 * DO NOT use this function directly, use `genToken` instead.
 * @param {JWTPayload} payload The payload to sign
 * @returns {string} The token
 */
export function sign(payload: JWTPayload): string {
  return jwt.sign(payload, jwtEnv.secret, options);
}

/**
 * Verifies a given JWT token and returns its payload.
 * @throws {APIError} If the token is invalid or expired
 * @param {string} token The token to verify
 * @returns {JWTPayload} The payload of the token
 */
export function extractPayload(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, jwtEnv.secret) as JWTPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      throw new APIError("Token expired", {
        cause: "token-expired",
        statusCode: 403
      });

    throw new APIError("Invalid token", {
      cause: "token-invalid",
      statusCode: 401
    });
  }
}

/** JWT expiration time in seconds. */
export const expiresIn = Number(
  options.expiresIn?.toString().replace(/[^0-9]/g, "") || 10
);

console.log(expiresIn)
