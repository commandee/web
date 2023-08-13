/// <reference types="astro/client-image" />

import type { JWTPayload } from "./server/auth/jwt";

type Auth =
  | {
      hasAuth: true;
      auth: JWTPayload;
    }
  | {
      hasAuth: false;
    };

declare global {
  namespace App {
    interface Locals {
      hasAuth: boolean;
      restaurant: string;
    }
  }
}
