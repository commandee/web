import type { APIRoute } from "astro";
import { bodyParser, responses } from "../../../server/api";
import { AuthData, tokenLogin } from "../../../server/login";
import APIError from "../../../server/model/APIError";

export const post: APIRoute = async ({ request }) => {
  const loginInfo = await bodyParser.any(request);

  try {
    const token = await tokenLogin.generate(loginInfo as AuthData);

    if (!(token instanceof APIError)) return responses.setToken(token);

    return token.toResponse();
  } catch (error) {
    return responses.internalServerError("Erro durante a autenticação");
  }
};

export const get: APIRoute = async () =>
  responses.methodNotAllowed("Use POST to authenticate");
