import type { APIRoute } from "astro";
import { Priority, PrismaClient } from "@prisma/client";
import { z } from "zod";

const toConnect = z
  .number().int().positive()
  .transform((value) => ({ connect: { id: value } }));

const orderSchema = z.object({
  quantity: z.number().int().positive(),
  priority: z.nativeEnum(Priority),
  annotations: z
    .string()
    .transform((value) => value || null)
    .nullable(),
  item: toConnect,
  command: toConnect,
});

export const post: APIRoute = async ({ request }) => {
  const order = orderSchema.safeParse(await request.json());
  const prisma = new PrismaClient();

  if (!order.success) {
    return new Response("Pedido inválido", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    await prisma.order.create({ data: order.data });

    return new Response("Pedido adicionado", {
      status: 201,
      statusText: "Created",
    });
  } catch (error) {
    return new Response("Erro ao adicionar pedido", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
