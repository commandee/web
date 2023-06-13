import type { APIRoute } from "astro";
import { assertParam, responses } from "../../../../server/api";
import { getAuth } from "../../../../server/auth/cookies";
import { getRestaurant } from "../../../../server/model/restaurant";

export const get: APIRoute = async ({ params, cookies }) => {
  assertParam(params, "restaurant");

  const { restaurant: restaurantName } = params;
  const { username } = getAuth(cookies);

  const restaurant = await getRestaurant(restaurantName);

  if (restaurant.owners.find(({ username: name }) => name === username))
    return responses.ok(restaurant);

  return responses.ok(restaurantName);
};
