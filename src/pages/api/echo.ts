import type { APIRoute } from "astro";
import { responses } from "../../server/api";

export const all: APIRoute = async ({ request }) => {
  const body = (await request.formData()).entries();
  const bodyObj: Record<string, unknown> = {};

  for (const [key, value] of body) bodyObj[key] = value;

  return responses.ok(bodyObj);
};
