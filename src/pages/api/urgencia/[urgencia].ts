import type { APIRoute } from "astro";
import { PrismaClient, Priority } from "@prisma/client";
import { z } from "zod";

export const prerender = true;

const prisma = new PrismaClient();
const schema = z.nativeEnum(Priority);

export const get: APIRoute = ({ params }) => {
  const urgencia = schema.safeParse(params.urgencia);

  if (!urgencia.success) {
    return new Response("Bad request", {
      status: 400,
      statusText: "Bad request"
    });
  }

  const pedidos = prisma.order.findMany({
    where: { priority: urgencia.data }
  });

  return new Response(JSON.stringify(pedidos), {
    status: 200,
    headers: { "content-type": "application/json; charset=UTF-8" }
  });
};
