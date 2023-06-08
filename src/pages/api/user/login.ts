import type { APIRoute } from "astro";
import { parseBody, responses } from "../../../server/api";
import APIError from "../../../server/model/APIError";
import { z } from "zod";
import type { AuthData } from "../../../server/auth/password";
import { setAuth } from "../../../server/auth/cookies";

function parseAuthData(data: {
  email?: string | undefined;
  username?: string | undefined;
  password: string;
}): AuthData {
  if (data.username && data.email)
    return {
      username: data.username,
      email: data.email,
      password: data.password
    };

  if (data.username)
    return { username: data.username, password: data.password };

  if (data.email) return { email: data.email, password: data.password };

  throw new APIError("Missing username or email", {
    cause: "validation",
    statusCode: 400
  });
}

const schema = z
  .object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string()
  })
  .transform(parseAuthData);

export const post: APIRoute = async ({ request, cookies }) => {
  try {
    const login = await parseBody(request, schema);
    await setAuth(cookies, login);

    return responses.ok("You are logged in");
  } catch (error) {
    if (error instanceof APIError) return error.toResponse();

    return responses.internalServerError();
  }
};

export const get: APIRoute = async () =>
  responses.methodNotAllowed("Use POST to authenticate");
