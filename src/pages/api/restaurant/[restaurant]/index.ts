import type { APIRoute } from "astro";
import { z } from "zod";
import { responses } from "../../../../server/api";
import prisma from "../../../../server/client";
import { getAuth } from "../../../../server/token";

export const get: APIRoute = async({ params, cookies }) => {
  const { restaurant: resProp } = params;

  const { username } = getAuth(cookies);

  const restaurantName = z.string().safeParse(resProp);

  if (!restaurantName.success)
    return responses.badRequest(restaurantName.error.message);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      name: restaurantName.data
    },
    include: {
      owners: {
        select: {
          name: true
        }
      }
    }
  });

  if (!restaurant)
    return responses.notFound("Restaurant not found");

  if (restaurant.owners.find(({ name }) => name === username)) {
    return responses.ok(restaurant);
  }

  return responses.ok(restaurantName);
};
