import type { APIRoute } from "astro";
import prisma from "../../../server/client";
import { responses } from "../../../server/api";

export const get: APIRoute = async () => {
  try {
    const pedidos = await prisma.order.findMany();
    return responses.ok(pedidos);
  } catch (error) {
    return responses.internalServerError("Erro ao buscar pedidos");
  }
};
