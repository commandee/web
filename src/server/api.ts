import type { Employee } from "@prisma/client";
import type { AuthToken } from "./login";

export async function parseJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

export const responses = {
  ok(body?: string | object | unknown[]): Response {
    if (!body || typeof body === "string")
      return new Response(body ?? "OK", {
        status: 200,
        statusText: "OK",
        headers: { "content-type": "text/plain; charset=UTF-8" }
      });

    return new Response(JSON.stringify(body), {
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json; charset=UTF-8" }
    });
  },

  created(body?: string | object | unknown[]): Response {
    if (!body || typeof body === "string")
      return new Response(body ?? "Created", {
        status: 201,
        statusText: "Created",
        headers: { "content-type": "text/plain; charset=UTF-8" }
      });

    return new Response(JSON.stringify(body), {
      status: 201,
      statusText: "Created",
      headers: { "content-type": "application/json; charset=UTF-8" }
    });
  },

  badRequest(body?: string | object | unknown[]): Response {
    if (!body || typeof body === "string")
      return new Response(body ?? "Bad Request", {
        status: 400,
        statusText: "Bad Request",
        headers: { "content-type": "text/plain; charset=UTF-8" }
      });

    return new Response(JSON.stringify(body), {
      status: 400,
      statusText: "Bad Request",
      headers: { "content-type": "application/json; charset=UTF-8" }
    });
  },

  internalServerError(message?: string): Response {
    return new Response(message ?? "Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "content-type": "text/plain; charset=UTF-8" }
    });
  },

  setToken(token: AuthToken): Response {
    return new Response("Logged-in sucessfully", {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "text/plain; charset=UTF-8",
        "set-cookie": `token=${token}; HttpOnly; Secure; SameSite=Strict`
      }
    });
  },

  setTokenCreated(token: AuthToken, user: Employee): Response {
    return new Response(JSON.stringify(user), {
      status: 201,
      statusText: "Created",
      headers: {
        "content-type": "application/json; charset=UTF-8",
        "set-cookie": `token=${token}; HttpOnly; Secure; SameSite=Strict`
      }
    });
  },

  methodNotAllowed(message?: string): Response {
    return new Response(message ?? "Method not Allowed", {
      status: 405,
      statusText: "Method Not Allowed",
      headers: { "content-type": "text/plain; charset=UTF-8" }
    });
  },

  notFound(message?: string): Response {
    return new Response(message ?? "Not Found", {
      status: 404,
      statusText: "Not Found",
      headers: { "content-type": "text/plain; charset=UTF-8" }
    });
  },

  unauthorized(message?: string): Response {
    return new Response(message ?? "Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
      headers: { "content-type": "text/plain; charset=UTF-8" }
    });
  },

  forbidden(message?: string): Response {
    return new Response(message ?? "Forbidden", {
      status: 403,
      statusText: "Forbidden",
      headers: { "content-type": "text/plain; charset=UTF-8" }
    });
  }
};
