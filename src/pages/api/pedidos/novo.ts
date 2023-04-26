import type { APIRoute } from "astro";
import { pedidos } from "../../../types";

export const post: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        
        if (!body.prato || (!body.horario) || !body.urgencia) {
            throw new Error("Missing required fields");
        }



        pedidos.push({
            prato: body.prato,
            horario: new Date(body.horario),
            anotacoes: body.anotacoes,
            urgencia: body.urgencia,
        });
    
        return new Response("Pedido adicionado", {
            status: 201, statusText: "Created"
        });
    } catch (error) {
        console.error(error);

        return new Response("Bad request", {
            status: 400, statusText: "Bad request"
        });
    }
}
