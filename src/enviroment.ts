import { config } from "dotenv";
import { z } from "zod";

config();

export const jwtEnv = {
  secret: z.string().parse(process.env.JWT_SECRET),
  expiresIn: z.string().default("30s").parse(process.env.JWT_EXPIRES_IN)
};
