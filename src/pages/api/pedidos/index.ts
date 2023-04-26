import type { APIRoute } from "astro";
import { pedidos } from "../../../types";

export const get: APIRoute = () => {
    return new Response(JSON.stringify(pedidos), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=UTF-8",
        },
    });
}
