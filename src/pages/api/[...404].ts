import type { APIRoute } from "astro";

export const get: APIRoute = () => {
    return new Response("Not found", {
        status: 404, statusText: "Not found"
    });
}
