import type {
	OpenAPIObject,
	OperationObject,
	ParameterObject,
	SchemaObject,
} from "openapi3-ts/oas31";

import { type } from "arktype";
import { P, match } from "ts-pattern";
import type { RouterCacheRecord } from "../../types/router.types";

export class OpenApiGenerator {
	private routerRecord: RouterCacheRecord[] = [];
	private apiUrl?: string;

	constructor(
		private readonly routes: RouterCacheRecord[],
		apiUrl?: string,
	) {
		this.routerRecord = routes;
		this.apiUrl = apiUrl;
	}

	replacePathParameters(path: string): string {
		return path.replace(/:([^/]+)/g, "{$1}");
	}

	extractPathParameters(path: string): ParameterObject[] {
		const paramRegex = /:([^/]+)/g;
		const matches = path.matchAll(paramRegex);
		const parameters = [];
		for (const match of matches) {
			parameters.push({
				name: match[1],
				in: "path" as const,
				required: true,
				schema: { type: "string" as const },
			});
		}
		return parameters;
	}

	run() {
		const openAPISpec: OpenAPIObject & { paths: Record<string, unknown> } = {
			openapi: "3.0.0",
			info: {
				title: "API Documentation",
				version: "1.0.0",
			},
			paths: {},
			servers: this.apiUrl
				? [
						{
							url: this.apiUrl,
						},
					]
				: [],
		};

		for (const route of this.routerRecord) {
			const voidSchema = type({});
			const schemas = route.schemas ? route.schemas : [voidSchema, voidSchema];

			const [inputSchema, outputSchema] = schemas;
			const path = this.replacePathParameters(route.route);
			const method = route.method.toLowerCase();

			const operation: OperationObject = {
				responses: {
					200: {
						description: "Successful response",
						content: {
							"application/json": {
								schema: outputSchema.toJsonSchema(),
							},
						},
					},
				},
				parameters: [...this.extractPathParameters(route.route)],
			};

			match(method)
				.with(P.union("post", "put", "patch"), () => {
					operation.requestBody = {
						content: {
							"application/json": {
								schema: inputSchema.toJsonSchema(),
							},
						},
					};
				})
				.with(P.union("get", "delete"), () => {
					const input = inputSchema.toJsonSchema() as unknown as {
						properties?: Record<string, SchemaObject> | undefined;
						required: string[];
					};
					if (input?.properties) {
						for (const key of Object.keys(input.properties)) {
							operation?.parameters.push({
								name: key,
								in: "query",
								required: input.required?.includes(key) ?? false,
								schema: input.properties[key],
							});
						}
					}
				})
				.otherwise(() => {});

			if (!openAPISpec.paths?.[path]) {
				openAPISpec.paths[path] = {};
			}

			openAPISpec.paths[path][method] = operation;
		}

		return openAPISpec;
	}
}
