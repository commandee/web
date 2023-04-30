import type { ZodSchema } from "zod";

export interface IModel<T> {
    schema: ZodSchema<T>;
    parse(data: unknown): T | Error;
    parseArray(data: unknown[]): T[] | Error;
}
