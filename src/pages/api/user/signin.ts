import type { APIRoute } from "astro";
import { EmployeeDTO, createEmployee } from "../../../server/login";
import { bodyParser, responses } from "../../../server/api";
import APIError from "../../../server/model/APIError";

export const post: APIRoute = async({ request }) => {
  try {
    const employee = await bodyParser.any(request);

    const createdEmployee = await createEmployee(employee as EmployeeDTO);
    if (createdEmployee instanceof APIError) return createdEmployee.toResponse();

    return responses.setTokenCreated(createdEmployee.token, createdEmployee);
  } catch (error) {
    return responses.internalServerError();
  }
};

export const get: APIRoute = async() =>
  responses.methodNotAllowed("Use POST to create a new employee");
