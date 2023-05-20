import type { APIRoute } from "astro";
import { checkAuth } from "../../../server/token";
import APIError from "../../../server/model/APIError";
import { responses } from "../../../server/api";

export const get: APIRoute = async({ cookies }) => {
  try {
    cookies.delete("token");
    checkAuth(cookies);

    return responses.ok("Logged out successfully");
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.cause) {
        case "token-expired":
          return responses.ok("Expired token was deleted");

        case "token-invalid":
          return responses.ok("Invalid token was deleted");

        default:
          return error.toResponse();
      }
    }

    return responses.internalServerError();
  }
};
