import type { APIRoute } from "astro";
import { getAuth } from "../../../../server/token";
import APIError from "../../../../server/model/APIError";
import { bodyParser, responses } from "../../../../server/api";
import { addOwner } from "../../../../server/restaurant";
import { z } from "zod";

const schema = z.object({
  username: z.string()
});

export const put: APIRoute = async({ cookies, request, params }) => {
  try {
    const { username } = getAuth(cookies);
    const { restaurant } = params;
    const newOwner = schema.safeParse(await bodyParser.json(request));

    if (!newOwner.success)
      return responses.badRequest(newOwner.error.message);

    addOwner(username, newOwner.data.username, restaurant as string);
    return responses.created("Owner added successfully");
  } catch (error) {
    if (error instanceof APIError)
      return error.toResponse();

    return responses.internalServerError();
  }
};
