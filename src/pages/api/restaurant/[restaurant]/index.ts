import type { APIRoute } from "astro";
import { assertParam, responses } from "../../../../server/api";
import { getAuth } from "../../../../server/auth/cookies";
import { getRestaurant } from "../../../../server/model/restaurant";
import APIError from "../../../../server/model/APIError";

export const get: APIRoute = async ({ params, cookies }) => {
  try {
    assertParam(params, "restaurantName");

    const { restaurantName } = params;
    const { username } = getAuth(cookies);

    const restaurant = await getRestaurant(restaurantName);

    if (restaurant.owners.find(({ username: name }) => name === username))
      return responses.ok(restaurant);

    return responses.ok(restaurantName);
  } catch (error) {
    if (error instanceof APIError) return error.toResponse();
    return responses.internalServerError();
  }
};
