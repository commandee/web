import type { Employee } from "@prisma/client";
import { AuthToken, tokenLogin } from "./login";
import type { AstroCookies } from "astro";
import APIError from "./model/APIError";
import { jwtEnv } from "../enviroment";

export const bodyParser = {
  async json(request: Request): Promise<unknown | APIError> {
    try {
      const body = await request.json();
      return body;
    } catch (error) {
      return new APIError("Invalid JSON", { cause: "invalid-json", statusCode: 400 });
    }
  },

  async form(request: Request): Promise<unknown | APIError> {
    try {
      const body = (await request.formData()).entries();
      const bodyObj: Record<string, unknown> = {};

      for (const [ key, value ] of body)
        bodyObj[key] = value;

      return bodyObj;
    } catch (error) {
      return new APIError("Invalid form data", { cause: "invalid-form-data", statusCode: 400 });
    }
  },

  async text(request: Request): Promise<unknown | APIError> {
    try {
      const body = await request.text();
      return body;
    } catch (error) {
      return new APIError("Invalid text", { cause: "invalid-text", statusCode: 400 });
    }
  },

  async any(request: Request): Promise<unknown | APIError> {
    switch (request.headers.get("content-type")) {
      case "application/json":
        return bodyParser.json(request);

      case "application/x-www-form-urlencoded":
        return bodyParser.form(request);

      case "text/plain":
        return bodyParser.text(request);

      default:
        return new APIError("Invalid content-type", { cause: "invalid-content-type", statusCode: 400 });
    }
  }
};

export function getToken(cookies: AstroCookies): AuthToken | APIError {
  if (!cookies.has("token"))
    return new APIError("You are not logged in", { cause: "token-not-found", statusCode: 401 });

  const token = cookies.get("token");
  if (!token?.value)
    return new APIError("Empty token", { cause: "token-empty", statusCode: 401 });

  return token.value;
}

export async function hasAuth(cookies: AstroCookies): Promise<boolean | APIError> {
  const token = getToken(cookies);
  if (token instanceof APIError) return token;

  const username = await tokenLogin.verify(token);
  if (username instanceof APIError) return username;

  return true;
}

export async function getUser(cookies: AstroCookies): Promise<Employee | APIError> {
  const token = getToken(cookies);
  if (token instanceof APIError) return token;

  const user = await tokenLogin.getUser(token);
  if (user instanceof APIError) return user;

  return user;
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
        "set-cookie": `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${jwtEnv.expiresIn}`
      }
    });
  },

  delToken(): Response {
    return new Response("Logged-out sucessfully", {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "text/plain; charset=UTF-8",
        "set-cookie": "token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
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
