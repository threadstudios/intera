import type { FastifyInstance } from "fastify";
import Container from "typedi";
import { Logger } from "../../logger";

export function withScalar({
  required,
  fastify,
}: {
  required: boolean;
  fastify: FastifyInstance;
}) {
  if (required) {
    const ScalarApiReference = require("@scalar/fastify-api-reference");
    fastify.register(ScalarApiReference, {
      routePrefix: "/reference",
      configuration: {
        theme: "kepler",
        spec: {
          url: "http://localhost:3100/public/api.json",
        },
      },
    });
    const logger = Container.get(Logger);
    logger.info("Scalar enabled: http://localhost:3100/reference");
  }
}
