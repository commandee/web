import type { APIRoute } from "astro";
import { getUser, responses } from "../../../server/api";
import APIError from "../../../server/model/APIError";

export const get: APIRoute = async ({ cookies }) => {
  const user = await getUser(cookies);
  if (user instanceof APIError) return user.toResponse();

  return responses.ok(
    `Hello ${user.name}\n\nuser: ${user.username}\nemail: ${user.email}`
  );
};
