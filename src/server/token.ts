import jwt from "jsonwebtoken";
import APIError from "./model/APIError";
import { jwtEnv } from "../enviroment";
import { AuthData, userLogin } from "./password";
import type { AstroCookies } from "astro";

export type JWTPayload = { username: string };

function signToken(payload: JWTPayload) {
  return jwt.sign(payload, jwtEnv.secret, { expiresIn: jwtEnv.expiresIn });
}

export async function genToken(authData: AuthData) {
  const username = await userLogin(authData);
  return signToken(username);
}

export function getLogin(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, jwtEnv.secret) as JWTPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      throw new APIError("Token expired", { cause: "token", statusCode: 403 });

    throw new APIError("Invalid token", { cause: "token", statusCode: 401 });
  }
}

export function verifyToken(token: string): void { getLogin(token); }

function extractToken(cookies: AstroCookies): string {
  if (!cookies?.has("token"))
    throw new APIError("Token not found", { cause: "cookies", statusCode: 401 });

  const token = cookies.get("token");
  if (!token?.value)
    throw new APIError("Token empty", { cause: "token", statusCode: 401 });

  return token.value;
}

export function checkAuth(cookies: AstroCookies): void {
  const token = extractToken(cookies);
  verifyToken(token);
}

export function getAuth(cookies: AstroCookies): JWTPayload {
  const token = extractToken(cookies);
  return getLogin(token);
}
