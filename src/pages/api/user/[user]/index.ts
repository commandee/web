import type { APIRoute } from "astro";
import { assertParam, responses } from "../../../../server/api";
import { getAuth } from "../../../../server/auth/cookies";
import { getEmployee } from "../../../../server/model/employee";

export const get: APIRoute = async ({ cookies, params }) => {
  assertParam(params, "user");

  const { username: auth } = getAuth(cookies);
  const { user } = params;

  const employee = await getEmployee({ username: user });

  if (user !== auth) return responses.ok({ username: employee.username });

  return responses.ok(employee);
};
