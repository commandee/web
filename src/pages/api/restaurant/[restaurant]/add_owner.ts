/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { APIRoute } from "astro";
import { getAuth } from "../../../../server/auth/cookies";
import APIError from "../../../../server/model/APIError";
import { assertParam, parseBody, responses } from "../../../../server/api";
import { addOwner } from "../../../../server/model/restaurant";
import { z } from "zod";

const schema = z.object({
  username: z.string()
});

export const put: APIRoute = async ({ cookies, request, params }) => {
  try {
    assertParam(params, "restaurant");

    const { username } = getAuth(cookies);
    const { restaurant } = params;
    const newOwner = await parseBody(request, schema);

    addOwner(username, newOwner.username, restaurant);
    return responses.created("Owner added successfully");
  } catch (error) {
    if (error instanceof APIError) return error.toResponse();
    return responses.internalServerError();
  }
};
