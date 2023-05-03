import prisma from "./client";
import { z } from "zod";
import APIError from "./model/APIError";
import bcrypt from "bcryptjs";
import type { JWTPayload } from "./token";

export type AuthData = {
  password: string;
  username?: string;
  email?: string;
}

export const authSchema = z.object({
  password: z.string(),
  username: z.string().optional(),
  email: z.string().email().optional()
}).refine((data) => data.username || data.email);

function parseAuth(auth: AuthData): [password: string, userInfo: { username: string } | { email: string }] {
  const data = authSchema.safeParse(auth);
  if (!data.success)
    throw new APIError(data.error.message, { cause: "validation", statusCode: 400 });

  const { password, username, email } = data.data;

  if (username) return [ password, { username }];
  if (email) return [ password, { email }];

  throw new APIError("You must provide an username or an email", { cause: "validation", statusCode: 400 });
}

export async function userLogin(auth: AuthData): Promise<JWTPayload> {
  const [ password, login ] = parseAuth(auth);

  const user = await prisma.employee.findUnique({
    where: login,
    select: {
      password: true,
      username: true
    }
  });

  if (!user)
    throw new APIError("User not found", { cause: "username", statusCode: 404 });

  if (!await bcrypt.compare(password, user.password))
    throw new APIError("Invalid password", { cause: "password", statusCode: 401 });

  return { username: user.username };
}
