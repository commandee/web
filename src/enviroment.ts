import { config } from "dotenv";
import { exit } from "process";

config();

function envAssert<T extends object, K extends keyof T>(
  obj: T,
  key: K
): asserts obj is T & Record<K, string> {
  if (key in obj) return;

  // eslint-disable-next-line no-console
  console.error(
    `Required environment variable '${String(key)}' was not provided`
  );
  exit(1);
}

envAssert(process.env, "DATABASE_URL");
envAssert(process.env, "JWT_SECRET");

process.env.JWT_EXPIRES_IN ??= "30s";

export const jwtEnv = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN
};
