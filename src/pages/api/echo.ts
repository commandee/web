import type { APIRoute } from "astro";
import { parseBody, responses } from "../../server/api";

export const all: APIRoute = async ({ request }) => {
  const body = await parseBody(request);
  return responses.ok(body as object);
};
