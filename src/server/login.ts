import type { Employee } from "@prisma/client";
import prisma from "./client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtEnv } from "../enviroment";
import { z } from "zod";
import APIError from "./model/APIError";

export type EmployeeDTO = Omit<Employee, "id" | "createdAt" | "updatedAt">;
export type AuthToken = string;

const hashOptions = {
  rounds: 10
};

const employeeSchema = z.object({
  username: z.string().trim().min(3),
  password: z.string().trim().min(6),
  email: z.string().trim().email(),
  name: z.string().trim().min(3)
});

function tokenGenerator(payload: string | object): AuthToken {
  return jwt.sign(payload, jwtEnv.secret, { expiresIn: jwtEnv.expiresIn });
}

export async function createEmployee(
  employee: EmployeeDTO
): Promise<(Employee & { token: AuthToken }) | APIError> {
  const validatedEmployee = employeeSchema.safeParse(employee);

  if (!validatedEmployee.success)
    return new APIError(validatedEmployee.error.message, {
      cause: "validation",
      statusCode: 400
    });

  try {
    validatedEmployee.data.password = await bcrypt.hash(
      validatedEmployee.data.password,
      hashOptions.rounds
    );
    return {
      ...(await prisma.employee.create({ data: validatedEmployee.data })),
      token: tokenGenerator({ username: validatedEmployee.data.username })
    };
  } catch (error) {
    return new APIError("Error while creating new user", {
      cause: "server",
      statusCode: 500
    });
  }
}

export type AuthData = {
  password: string;
  username?: string | undefined;
  email?: string | undefined;
};

const authSchema = z
  .object({
    password: z.string().min(6),
    username: z.string().min(3).optional(),
    email: z.string().email().optional()
  })
  .refine((data) => data.username || data.email, {
    message: "You must provide an username or an email",
    path: ["username", "email"]
  });

function getAuthInfo(
  user: AuthData
):
  | [password: string, userInfo: { username: string } | { email: string }]
  | APIError {
  const parsedUser = authSchema.safeParse(user);
  if (!parsedUser.success)
    return new APIError(parsedUser.error.message, {
      cause: "validation",
      statusCode: 400
    });

  const { password, username, email } = parsedUser.data;

  if (username) return [password, { username }];
  if (email) return [password, { email }];

  return new APIError("You must provide an username or an email", {
    cause: "validation",
    statusCode: 400
  });
}

export const passwordLogin = {
  async verify(auth: AuthData): Promise<string | APIError> {
    const parsed = getAuthInfo(auth);
    if (parsed instanceof APIError) return parsed;

    const [password, login] = parsed;

    try {
      const user = await prisma.employee.findUnique({
        where: login,
        select: {
          password: true,
          username: true
        }
      });
      if (!user)
        return new APIError("User not found", {
          cause: "username",
          statusCode: 404
        });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return new APIError("Invalid password", {
          cause: "password",
          statusCode: 401
        });

      return user.username;
    } catch (error) {
      return new APIError("Error while validating password", {
        cause: "server",
        statusCode: 500
      });
    }
  }
};

export const tokenLogin = {
  async decode(token: AuthToken): Promise<string | APIError> {
    try {
      const decoded = jwt.verify(token, jwtEnv.secret) as { username: string };
      if (!decoded?.username)
        return new APIError("Invalid token", {
          cause: "token-invalid",
          statusCode: 401
        });

      return decoded.username;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        return new APIError("Token expired", {
          cause: "token-expired",
          statusCode: 403
        });

      return new APIError("Invalid token", {
        cause: "token-invalid",
        statusCode: 401
      });
    }
  },

  async generate(auth: AuthData): Promise<AuthToken | APIError> {
    const username = await passwordLogin.verify(auth);
    if (username instanceof APIError) return username;

    return tokenGenerator({ username });
  },

  async verify(token: AuthToken): Promise<boolean | APIError> {
    const decoded = await tokenLogin.decode(token);
    if (decoded instanceof APIError) return decoded;

    try {
      const user = await prisma.employee.findUnique({
        where: { username: decoded },
        select: {}
      });
      if (user === null)
        return new APIError("User not found", {
          cause: "username",
          statusCode: 404
        });

      return true;
    } catch (error) {
      return new APIError("Error while validating token", {
        cause: "server",
        statusCode: 500
      });
    }
  },

  async getUser(token: AuthToken): Promise<Employee | APIError> {
    const decoded = await tokenLogin.decode(token);
    if (decoded instanceof APIError) return decoded;

    try {
      const user = await prisma.employee.findUnique({
        where: { username: decoded }
      });
      if (!user)
        return new APIError("User not found", {
          cause: "username",
          statusCode: 404
        });
      return user;
    } catch (error) {
      return new APIError("Error while validating token", {
        cause: "server",
        statusCode: 500
      });
    }
  }
};
