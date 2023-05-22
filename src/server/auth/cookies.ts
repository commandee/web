import type { AstroCookies } from "astro";
import APIError from "../model/APIError";
import { JWTPayload, expiresIn, extractPayload } from "./jwt";
import type { AuthData } from "./password";
import { genToken } from "./token";

/**
 * Extracts the token from the cookies and returns it.
 * @throws {APIError} If the token is not found or is empty
 * @param {AstroCookies} cookies The cookies
 * @returns {string} The token
 * @private
 */
function extractToken(cookies: AstroCookies): string {
  if (!cookies?.has("token"))
    throw new APIError("Token not found", { cause: "token-not-found", statusCode: 401 });

  const token = cookies.get("token");
  if (!token?.value)
    throw new APIError("Token is empty", { cause: "token-empty", statusCode: 401 });

  return token.value;
}

/**
 * Gets a token from the cookies, verifies it and returns its payload.
 * @throws {APIError} If the token is not found, empty, invalid or expired
 * @param {AstroCookies} cookies The cookies
 * @returns {JWTPayload} Payload containing the username
 */
export function getAuth(cookies: AstroCookies): JWTPayload {
  const token = extractToken(cookies);
  return extractPayload(token);
}

/**
 * Sets a JWT token in the cookies.
 * @param {AstroCookies} cookies The cookies
 * @param {string} token The token
 * @returns {void}
 */
export function setToken(cookies: AstroCookies, token: string): void {
  cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: expiresIn
  });
}

/**
 * Deletes the JWT token stored in the cookies
 * @param {AstroCookies} cookies The cookies
 * @returns {void}
 */
export function delToken(cookies: AstroCookies) {
  let exception: unknown = null;

  try {
    getAuth(cookies);
  } catch (error) {
    exception = error;
  } finally {
    cookies.delete("token");
  }

  if (exception) throw exception;
}

/**
 * Authenticates the user and sets a JWT token in their cookies.
 * @throws {APIError} If the user is not found or the password is invalid
 * @param {AstroCookies} cookies The cookies
 * @param {AuthData} auth The user's credentials
 * @returns {Promise<void>} Nothing
 */
export async function setAuth(cookies: AstroCookies, auth: AuthData): Promise<void> {
  const token = await genToken(auth);
  setToken(cookies, token);
}
