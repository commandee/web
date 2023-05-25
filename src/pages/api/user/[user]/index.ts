import type { APIRoute } from "astro";
import { assertParam, responses } from "../../../../server/api";
import { getAuth } from "../../../../server/auth/cookies";
import { getEmployee } from "../../../../server/model/employee";
import APIError from "../../../../server/model/APIError";

export const get: APIRoute = async({ cookies, params }) => {
  try {
    assertParam(params, "user");

    const { username: auth } = getAuth(cookies);
    const { user } = params;

    const employee = await getEmployee({ username: user });

    if (user !== auth) return responses.ok({ username: employee.username });

    return responses.ok(employee);
  } catch (error) {
    if (error instanceof APIError) return error.toResponse();

    return responses.internalServerError();
  }
};
