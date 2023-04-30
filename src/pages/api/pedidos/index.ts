import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";

export const get: APIRoute = async() => {
    const prisma = new PrismaClient();

    try {
        const pedidos = await prisma.order.findMany();
        
        return new Response(JSON.stringify(pedidos), {
            status: 200,
            statusText: "OK",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "Internal Server Error",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        });
    }
}
