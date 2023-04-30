import type { APIRoute } from "astro";
import { Priority, PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const schema = z.nativeEnum(Priority);

export const get: APIRoute = async({ params }) => {
  const urgencia = schema.safeParse(params.urgencia);

  if (!urgencia.success) {
    return new Response(JSON.stringify(urgencia.error), {
      status: 400,
      statusText: "Bad Request",
      headers: { "content-type": "application/json; charset=UTF-8" }
    });
  }

  const pedidos = await prisma.order.findMany({
    where: { priority: urgencia.data },
    include: {
      item: true
    }
  });

  return new Response(JSON.stringify(pedidos), {
    status: 200,
    statusText: "OK",
    headers: { "content-type": "application/json; charset=UTF-8" }
  });
};

export function getStaticPaths() {
  return Object.values(Priority)
    .map((priority) =>
      ({ params: { urgencia: priority } }));
}
