import APIError from "./model/APIError";
import { AuthData, userLogin } from "./password";
import type { AstroCookies } from "astro";
import { sign, verify } from "./jwt";
import { TokenExpiredError } from "jsonwebtoken";

export type JWTPayload = { username: string };

export async function genToken(authData: AuthData) {
  const username = await userLogin(authData);
  return sign(username);
}

export function getUsername(token: string): JWTPayload {
  try {
    const payload = verify(token);
    return payload;
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw new APIError("Token expired", { cause: "token-expired", statusCode: 403 });

    throw new APIError("Invalid token", { cause: "token-invalid", statusCode: 401 });
  }
}

export function verifyToken(token: string): void { getUsername(token); }

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
  return getUsername(token);
}
