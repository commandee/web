import type { ZodSchema, ZodTypeDef } from "zod";
import APIError from "./model/APIError";
import type { Params } from "astro";

const bodyParser = {
  async json(request: Request): Promise<unknown> {
    try {
      const body = await request.json();
      return body;
    } catch (error) {
      throw new APIError("Invalid JSON", { cause: "invalid-json", statusCode: 400 });
    }
  },

  async form(request: Request): Promise<Record<string, unknown>> {
    try {
      const body = (await request.formData()).entries();
      const bodyObj: Record<string, unknown> = {};

      for (const [key, value] of body) bodyObj[key] = value.valueOf();

      if (Object.keys(bodyObj).length === 0) throw undefined;

      return bodyObj;
    } catch (error) {
      throw new APIError("Invalid form data", { cause: "invalid-form", statusCode: 400 });
    }
  },

  async text(request: Request): Promise<string> {
    try {
      const body = await request.text();
      return body;
    } catch (error) {
      throw new APIError("Invalid text", { cause: "invalid-text", statusCode: 400 });
    }
  },

  async any(request: Request): Promise<unknown> {
    const contentType = request.headers.get("Content-Type")?.split(";")[0];

    switch (contentType) {
      case "application/json":
        return bodyParser.json(request);

      case "application/x-www-form-urlencoded":
      case "multipart/form-data":
        return bodyParser.form(request);

      case "text/plain":
        return bodyParser.text(request);

      default:
        throw new APIError(`Invalid Content-Type: ${contentType}`, {
          cause: "invalid-content-type",
          statusCode: 400
        });
    }
  }
};

/**
 * Parses the body of a request (JSON, form data, or plain text) and validates it against a Zod schema.
 * @throws {APIError} If the body is invalid or the Content-Type is invalid
 * @throws {APIError} If the body does not match the schema
 * @param {Request} request The request to parse the body from
 * @param {ZodSchema<Output> | ZodEffects<ZodSchema<Input>, Output>} schema The schema to validate the body against
 * @returns {Promise<Output>} The parsed body
 */
export async function parseBody<
  Output = unknown,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
>(request: Request, schema?: ZodSchema<Output, Def, Input>): Promise<Output> {
  const body = await bodyParser.any(request);
  if (!schema) return body as Output;

  const parsed = schema.safeParse(body);

  if (!parsed.success)
    throw new APIError(parsed.error.message, { cause: "validation", statusCode: 400 });

  return parsed.data;
}

/**
 * Asserts that a url parameter is present and is a string.
 * @throws {Error} If the parameter is not present or is not a string
 * @param {object} obj The object to check
 * @param {string} key The key to check
 * @returns {void}
 */
export function assertParam<T extends Params, K extends keyof T>(
  obj: T,
  key: K
): asserts obj is T & Record<K, string> {
  if (!(key in obj) || typeof obj[key] !== "string" || !obj[key]) {
    throw new Error(`Required parameter '${String(key)}' was not provided`);
  }
}

/** Responses for the API */
export const responses = {
  ok(body?: string | object | unknown[]): Response {
    if (!body || typeof body === "string")
      return new Response(body ?? "OK", {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "text/plain; charset=UTF-8" }
      });

    return new Response(JSON.stringify(body), {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "application/json; charset=UTF-8" }
    });
  },

  created(body?: string | object | unknown[]): Response {
    if (!body || typeof body === "string")
      return new Response(body ?? "Created", {
        status: 201,
        statusText: "Created",
        headers: { "Content-Type": "text/plain; charset=UTF-8" }
      });

    return new Response(JSON.stringify(body), {
      status: 201,
      statusText: "Created",
      headers: { "Content-Type": "application/json; charset=UTF-8" }
    });
  },

  badRequest(body?: string | object | unknown[]): Response {
    if (!body || typeof body === "string")
      return new Response(body ?? "Bad Request", {
        status: 400,
        statusText: "Bad Request",
        headers: { "Content-Type": "text/plain; charset=UTF-8" }
      });

    return new Response(JSON.stringify(body), {
      status: 400,
      statusText: "Bad Request",
      headers: { "Content-Type": "application/json; charset=UTF-8" }
    });
  },

  internalServerError(message?: string): Response {
    return new Response(message ?? "Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
  },

  methodNotAllowed(message?: string): Response {
    return new Response(message ?? "Method not Allowed", {
      status: 405,
      statusText: "Method Not Allowed",
      headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
  },

  notFound(message?: string): Response {
    return new Response(message ?? "Not Found", {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
  },

  unauthorized(message?: string): Response {
    return new Response(message ?? "Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
      headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
  },

  forbidden(message?: string): Response {
    return new Response(message ?? "Forbidden", {
      status: 403,
      statusText: "Forbidden",
      headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
  }
};
