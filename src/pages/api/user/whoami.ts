import type { APIRoute } from "astro";
import { responses } from "../../../server/api";
import { tokenLogin } from "../../../server/login";
import APIError from "../../../server/model/APIError";

export const get: APIRoute = async({ cookies }) => {
  const token = cookies.get("token");
  if (!token?.value) return responses.unauthorized("You are not logged in");

  const user = await tokenLogin.getUser(token.value);
  if (user instanceof APIError) return user.toResponse();

  return responses.ok(`Hello ${user.name}\n\nuser: ${user.username}\nemail: ${user.email}`);
};
