import type { APIRoute } from "astro";
import { responses } from "../../server/api";

export const all: APIRoute = () => responses.notFound();
