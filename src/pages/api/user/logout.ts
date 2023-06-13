import type { APIRoute } from "astro";
import { delToken } from "../../../server/auth/cookies";
import { responses } from "../../../server/api";

export const get: APIRoute = async ({ cookies }) => {
  delToken(cookies);
  return responses.ok("Logged out successfully");
};
