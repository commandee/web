import type { APIRoute } from "astro";
import { responses } from "../../server/api";
import prisma from "../../server/client";

export const get: APIRoute = async () => {
  try {
    await prisma.$connect();
    return responses.ok("Conectado ao banco de dados");
  } catch (error) {
    return responses.internalServerError("Erro ao conectar ao banco de dados");
  }
};
