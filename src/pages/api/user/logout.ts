import type { APIRoute } from "astro";
import { getToken, responses } from "../../../server/api";

export const get: APIRoute = async ({ cookies }) => {
  const token = getToken(cookies);
  if (token instanceof Error) return token.toResponse();

  return responses.delToken();
};
