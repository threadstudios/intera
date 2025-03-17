import { ArkErrors, type Type } from "arktype";
import { BadRequestError } from "../errors";

export function validate(type: Type, data: unknown) {
  const result = type(data);
  if (result instanceof ArkErrors) {
    throw new BadRequestError({
      message: "Validation Failed",
      body: {
        errors: result.map((res) => res.message),
      },
    });
  }
}
