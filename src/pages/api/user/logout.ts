import type { APIRoute } from "astro";
import { delToken } from "../../../server/auth/cookies";
import { responses } from "../../../server/api";

export const get: APIRoute = async ({ cookies, redirect }) => {
  delToken(cookies);

  redirect("/");
  return responses.ok("Logged out successfully");
};
