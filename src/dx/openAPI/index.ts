import Container from "typedi";
import path from "node:path";
import type { RouterCacheRecord } from "../../types/router.types";
import { Intera__Config } from "../../config";

export function withOpenApiGenerator({
  required,
  routes,
}: {
  required: boolean;
  routes: RouterCacheRecord[];
}) {
  if (required) {
    const { OpenApiGenerator } = require("./generator");
    const Generator = new OpenApiGenerator(routes);
    const data = Generator.run();
    const config = Container.get(Intera__Config);
    Bun.write(
      path.join(config.appDirectory, "public", "api.json"),
      JSON.stringify(data, null, 2)
    );
  }
}
