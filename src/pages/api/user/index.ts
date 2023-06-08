import type { APIRoute } from "astro";
import prisma from "../../../server/client";
import { responses } from "../../../server/api";
import APIError from "../../../server/model/APIError";

export const get: APIRoute = async () => {
  if (process.env.NODE_ENV !== "development") return responses.notFound();

  try {
    const users = await prisma.employee.findMany();
    return responses.ok(users);
  } catch (error) {
    if (error instanceof APIError) return error.toResponse();
    return responses.internalServerError();
  }
};
