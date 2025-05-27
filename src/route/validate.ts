import { ZodType } from "zod/v4";
import { safeParse } from "zod/v4-mini";
import { ValidationError } from "../errors";

export function validate(schema: ZodType, data: unknown, reference: string) {
  const result = safeParse(schema, data);
  if (result.error) {
    throw new ValidationError({ error: result.error, reference });
  }
}
