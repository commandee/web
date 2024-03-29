import type { APIRoute } from "astro";
import { parseBody, responses } from "../../../server/api";
import { z } from "zod";
import { getAuth } from "../../../server/auth/cookies";
import { createRestaurant } from "../../../server/model/restaurant";

const schema = z.object({
  name: z.string(),
  address: z.string()
});

export const post: APIRoute = async ({ request, cookies }) => {
  const { username } = getAuth(cookies);
  const restaurant = await parseBody(request, schema);

  await createRestaurant(username, restaurant);

  return responses.created("Restaraunt created successfully");
};
