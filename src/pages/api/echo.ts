import type { APIRoute } from "astro";
import { parseBody, responses } from "../../server/api";
import APIError from "../../server/model/APIError";

export const all: APIRoute = async({ request }) => {
  try {
    const body = await parseBody(request);
    return responses.ok(body as object);
  } catch (error) {
    if (error instanceof APIError)
      return error.toResponse();
    return responses.internalServerError();
  }
};
