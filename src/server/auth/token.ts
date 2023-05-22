import { AuthData, userLogin } from "./password";
import { extractPayload, sign } from "./jwt";

export type JWTPayload = { username: string };

/**
 * Generates a token for a user from their credentials.
 * @throws {APIError} If the user is not found or the password is invalid
 * @param {AuthData} authData The user's credentials
 * @returns {Promise<string>} The token
 */
export async function genToken(authData: AuthData): Promise<string> {
  const username = await userLogin(authData);
  return sign(username);
}

/**
 * Extracts the username from given a token.
 * @throws {APIError} If the token is invalid or expired
 * @param {string} token The token
 * @returns {string} The username
 */
export function getUsername(token: string): string {
  return extractPayload(token).username;
}
