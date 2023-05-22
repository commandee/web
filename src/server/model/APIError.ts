import { STATUS_CODES } from "http";

type Cause =
  | "username"
  | "password"
  | "server"
  | "validation"
  | "token-expired"
  | "token-invalid"
  | "token-not-found"
  | "token-empty"
  | "invalid-json"
  | "invalid-form"
  | "invalid-text"
  | "invalid-content-type";

export default class APIError extends Error {
  statusCode: number;
  override cause: Cause;

  constructor(message: string, { cause, statusCode }: { cause: Cause; statusCode: number }) {
    super(message);
    this.statusCode = statusCode;
    this.cause = cause;
  }

  toResponse(): Response {
    return new Response(this.message, {
      status: this.statusCode,
      statusText: STATUS_CODES[this.statusCode] ?? "Unknown Error",
      headers: {
        "content-type": "text/plain; charset=UTF-8"
      }
    });
  }
}
