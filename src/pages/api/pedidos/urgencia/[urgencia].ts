import type { APIRoute } from "astro";
import { pedidos } from "../../../../types";

export const get: APIRoute = ({ params }) => {
    const urgencia = params.urgencia;

    if (!urgencia)
        return new Response("Bad request", {
            status: 400, statusText: "Bad request"
        });

    return new Response(JSON.stringify(pedidos.filter(pedido => pedido.urgencia === urgencia)), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=UTF-8",
        },
    });
}

