import type { APIRoute } from "astro";
import { bodyParser, responses } from "../../../server/api";
import { z } from "zod";
import { getAuth } from "../../../server/token";
import APIError from "../../../server/model/APIError";
import { createRestaurant } from "../../../server/restaurant";

const schema = z.object({
  name: z.string(),
  address: z.string()
});

export const post: APIRoute = async({ request, cookies }) => {
  try {
    const { username } = getAuth(cookies);
    const restaurant = schema.safeParse(await bodyParser.any(request));

    if (!restaurant.success)
      return responses.badRequest(restaurant.error.message);

    await createRestaurant(username, restaurant.data);

    return responses.created("Restaraunt created successfully");
  } catch (error) {
    if (error instanceof APIError)
      return error.toResponse();
    return responses.internalServerError();
  }
};
