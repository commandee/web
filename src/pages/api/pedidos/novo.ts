import type { APIRoute } from "astro";
import { Priority } from "@prisma/client";
import { z } from "zod";
import prisma from "../../../server/client";
import { bodyParser, responses } from "../../../server/api";

const toConnect = z
  .number()
  .int()
  .positive()
  .transform((value) => ({ connect: { id: value } }));

const schema = z.object({
  quantity: z.number().int().positive(),
  priority: z.nativeEnum(Priority),
  annotations: z
    .string()
    .trim()
    .transform((value) => value || null)
    .nullable(),
  item: toConnect,
  command: toConnect
});

export const post: APIRoute = async ({ request }) => {
  const order = schema.safeParse(await bodyParser.any(request));

  if (!order.success) return responses.badRequest(order.error.message);

  try {
    const resOrder = await prisma.order.create({ data: order.data });
    return responses.created(resOrder);
  } catch (error) {
    return responses.internalServerError("Erro ao adicionar pedido");
  }
};
