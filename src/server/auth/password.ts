import prisma from "../client";
import { z } from "zod";
import APIError from "../model/APIError";
import bcrypt from "bcryptjs";
import type { JWTPayload } from "./token";

/** Data for user authentication, can be either username or email */
export type AuthData = {
  password: string;
} & (
  | { username: string }
  | { email: string }
  | { username: string; email: string }
);

function parseAuth(
  auth: AuthData
): [password: string, userInfo: { username: string } | { email: string }] {
  if ("username" in auth) {
    return [auth.password, { username: auth.username }];
  }

  const email = z.string().email().safeParse(auth.email);
  if (!email.success)
    throw new APIError(email.error.message, {
      cause: "validation",
      statusCode: 400
    });

  return [auth.password, { email: email.data }];
}

/**
 * Gets the user's credentials and checks if they are valid against the database.
 * @throws {APIError} If the user is not found or the password is invalid
 * @param {AuthData} auth The user's credentials
 * @returns {Promise<JWTPayload>} Object containing the username
 */
export async function userLogin(auth: AuthData): Promise<JWTPayload> {
  const [password, login] = parseAuth(auth);

  const user = await prisma.employee.findUnique({
    where: login,
    select: {
      password: true,
      username: true
    }
  });

  if (!user)
    throw new APIError("User not found", {
      cause: "username",
      statusCode: 404
    });

  if (!(await bcrypt.compare(password, user.password)))
    throw new APIError("Invalid password", {
      cause: "password",
      statusCode: 401
    });

  return { username: user.username };
}
