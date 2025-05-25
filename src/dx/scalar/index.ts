import type { FastifyInstance } from "fastify";
import Container from "typedi";
import { Logger } from "../../logger";

export async function withScalar({
	required,
	fastify,
}: {
	required: boolean;
	fastify: FastifyInstance;
}) {
	if (required) {
		await fastify.register(import("@scalar/fastify-api-reference"), {
			routePrefix: "/docs",
			logLevel: "info",
			configuration: {
				url: "/public/api.json",
			},
		});

		const logger = Container.get(Logger);
		logger.info("Scalar enabled\t\t/docs");
	}
}
