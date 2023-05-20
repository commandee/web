import type { APIRoute } from "astro";
import { bodyParser, responses } from "../../../server/api";
import { genToken } from "../../../server/token";
import type { AuthData } from "../../../server/password";
import { expiresIn } from "../../../server/jwt";
import APIError from "../../../server/model/APIError";

export const post: APIRoute = async({ request, cookies }) => {
  const loginInfo = await bodyParser.any(request);

  try {
    const token = await genToken(loginInfo as AuthData);

    cookies.set("token", token, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    return responses.ok("You are logged in");
  } catch (error) {
    if (error instanceof APIError)
      return error.toResponse();

    return responses.internalServerError();
  }
};

export const get: APIRoute = async () => responses.methodNotAllowed("Use POST to authenticate");
