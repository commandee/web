import type { APIRoute } from "astro";
import { responses } from "../../../server/api";
import { getAuth } from "../../../server/auth/cookies";
import { getEmployee } from "../../../server/model/employee";

export const get: APIRoute = async ({ cookies }) => {
  const { username } = getAuth(cookies);

  const user = await getEmployee({ username });

  return responses.ok(
    `Hello ${user.name}\n\nuser: ${user.username}\nemail: ${user.email}`
  );
};
