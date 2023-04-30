import type { APIRoute } from "astro";
import { Priority, PrismaClient } from "@prisma/client";
import { z } from "zod";

export const get: APIRoute = async ({ params }) => {
    const prisma = new PrismaClient;
    const urgencia = z.nativeEnum(Priority).safeParse(params.urgencia);

    if (urgencia.success) {
        const pedidos = await prisma.order.findMany({
            where: {
                priority: urgencia.data
            },
            include: {
                item: true
            }
        })

        return new Response(JSON.stringify(pedidos), {
            status: 200,
            statusText: "OK",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        });
    } else {
        return new Response(JSON.stringify(urgencia.error), {
            status: 400,
            statusText: "Bad Request",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        });
    }
}
