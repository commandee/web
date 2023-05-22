import type { APIRoute } from "astro";
import { createEmployee } from "../../../server/model/employee";
import { parseBody, responses } from "../../../server/api";
import { setToken } from "../../../server/auth/cookies";
import { z } from "zod";
import APIError from "../../../server/model/APIError";

const schema = z.object({
  name: z.string(),
  username: z.string().regex(/^[a-zA-Z0-9_-]{4,15}$/),
  email: z.string().email(),
  password: z.string().min(8)
});

export const post: APIRoute = async({ request, cookies }) => {
  try {
    const employee = await parseBody(request, schema);
    const [ , token ] = await createEmployee(employee);

    setToken(cookies, token);
    return responses.created(employee);
  } catch (error) {
    if (error instanceof APIError)
      return error.toResponse();
    return responses.internalServerError();
  }
};

export const get: APIRoute = async() =>
  responses.methodNotAllowed("Use POST to create a new employee");
