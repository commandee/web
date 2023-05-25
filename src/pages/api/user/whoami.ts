import type { APIRoute } from "astro";
import { responses } from "../../../server/api";
import APIError from "../../../server/model/APIError";
import { getAuth } from "../../../server/auth/cookies";
import { getEmployee } from "../../../server/model/employee";

export const get: APIRoute = async({ cookies }) => {
  try {
    const { username } = getAuth(cookies);

    const user = await getEmployee({ username });

    return responses.ok(`Hello ${user.name}\n\nuser: ${user.username}\nemail: ${user.email}`);
  } catch (error) {
    if (error instanceof APIError) return error.toResponse();
    return responses.internalServerError();
  }
};
