import type { APIRoute } from "astro";
import { Priority } from "@prisma/client";
import { z } from "zod";
import prisma from "../../../../server/client";
import { responses } from "../../../../server/api";

const schema = z.nativeEnum(Priority);

export const get: APIRoute = async ({ params }) => {
  const urgencia = schema.safeParse(params.urgencia);

  if (!urgencia.success) return responses.badRequest(urgencia.error);

  const pedidos = await prisma.order.findMany({
    where: { priority: urgencia.data },
    include: {
      item: true
    }
  });

  return responses.ok(pedidos);
};
