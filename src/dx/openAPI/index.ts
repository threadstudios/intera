import path from "node:path";
import Container from "typedi";
import { Intera__Config } from "../../config";
import type { RouterCacheRecord } from "../../types/router.types";

export function withOpenApiGenerator({
	required,
	routes,
}: {
	required: boolean;
	routes: RouterCacheRecord[];
}) {
	if (required) {
		const config = Container.get(Intera__Config);
		const { OpenApiGenerator } = require("./generator");
		const Generator = new OpenApiGenerator(routes, config.apiBaseUrl);
		const data = Generator.run();
		Bun.write(
			path.join(config.appDirectory, "public", "api.json"),
			JSON.stringify(data, null, 2),
		);
	}
}
