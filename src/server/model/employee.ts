import type { Employee } from "@prisma/client";
import { sign } from "../auth/jwt";
import prisma from "../client";
import APIError from "./APIError";
import * as bcrypt from "bcryptjs";

/** Type containing only the necessary info for creating an employee */
export type EmployeeDTO = Omit<Employee, "id" | "createdAt" | "updatedAt">;

const hashOptions = {
  rounds: 10
};

/**
 * Creates a new employee and returns the employee and the token
 * @throws {APIError} If the employee could not be created
 * @param {EmployeeDTO} employee The employee's data
 * @returns {Promise<[Employee, string]>} Tuple containing the employee and the token
 * @async
 */
export async function createEmployee(employee: EmployeeDTO): Promise<[Employee, string]> {
  try {
    if (employee.username.match(/^[a-zA-Z0-9_-]{4,15}$/) === null)
      throw new APIError("Invalid username", { cause: "username", statusCode: 400 });

    const dbEmployee = await prisma.employee.create({
      data: {
        ...employee,
        password: await bcrypt.hash(employee.password, hashOptions.rounds)
      }
    });

    const token = sign({ username: dbEmployee.username });
    return [ dbEmployee, token ];
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Error while creating new employee", { cause: "server", statusCode: 500 });
  }
}

/**
 * Finds an employee by their username or email.
 * @throws {APIError} If the employee is not found
 * @param {object} params Employee's search params. Must contain either the username or the email
 * @param {string} params.username The employee's username
 * @param {string} params.email The employee's email
 * @returns {Promise<Employee>} The employee
 * @async
 */
export async function getEmployee(params: { username?: string, email?: string }): Promise<Employee> {
  if (!params.username && !params.email)
    throw new APIError("No username or email provided", { cause: "username", statusCode: 400 });

  const employee = await prisma.employee.findUnique({
    where: params
  });

  if (!employee)
    throw new APIError("Employee not found", { cause: "username", statusCode: 404 });

  return employee;
}
