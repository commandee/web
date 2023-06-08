import type { APIRoute } from "astro";
import { delToken } from "../../../server/auth/cookies";
import APIError from "../../../server/model/APIError";
import { responses } from "../../../server/api";

export const get: APIRoute = async ({ cookies }) => {
  try {
    delToken(cookies);
    return responses.ok("Logged out successfully");
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.cause) {
        case "token-empty":
        case "token-not-found":
          return responses.badRequest("You are not logged in");

        case "token-invalid":
          return responses.badRequest("Invalid session");

        case "token-expired":
          return responses.badRequest("Session expired");

        default:
          return error.toResponse();
      }
    }

    return responses.internalServerError();
  }
};
