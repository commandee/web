import type { Restaurant } from "@prisma/client";
import prisma from "./client";
import APIError from "./model/APIError";

type RestaurantInfo = Omit<Restaurant, "id" | "createdAt" | "updatedAt">;

export async function createRestaurant(owner: string, resInfo: RestaurantInfo) {
  try {
    prisma.restaurant.create({
      data: {
        ...resInfo,
        owners: {
          connect: {
            username: owner
          }
        }
      }
    });
  } catch (error) {
    throw new APIError("Error while creating new restaurant", { cause: "server", statusCode: 500 });
  }
}

export async function ownsRestaurant(user: string, restaurant: string): Promise<boolean> {
  const res = await prisma.restaurant.findUnique({
    where: {
      name: restaurant
    },
    select: {
      owners: {
        select: {
          username: true
        }
      }
    }
  });

  if (!res)
    throw new APIError("Restaurant not found", { cause: "restaurant", statusCode: 404 });

  return !!res.owners.find((owner) => owner.username === user);
}

export async function checkOwnership(user: string, restaurant: string) {
  const owns = await ownsRestaurant(user, restaurant);

  if (!owns)
    throw new APIError("You're not an owner of this restaurant", { cause: "username", statusCode: 403 });
}

export async function addOwner(owner: string, newOwner: string, restaurant: string) {
  await checkOwnership(owner, restaurant);

  try {
    prisma.restaurant.update({
      where: {
        name: restaurant
      },
      data: {
        owners: {
          connect: {
            username: newOwner
          }
        }
      }
    });
  } catch (error) {
    throw new APIError("Error while adding new owner", { cause: "server", statusCode: 500 });
  }
}
