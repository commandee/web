import type { APIRoute } from "astro";
import prisma from "../../../server/client";
import { responses } from "../../../server/api";

export const get: APIRoute =
  process.env.NODE_ENV !== "development"
    ? async () => responses.notFound()
    : async () => {
        if (process.env.NODE_ENV !== "development") return responses.notFound();

        const users = await prisma.employee.findMany();
        return responses.ok(users);
      };
