import Container from "typedi";
import { join } from "node:path";
import { Intera__Config } from "../../config";
import { Logger } from "../../logger";

export function withApiClient({
  required,
}: {
  required?: string[] | undefined;
}) {
  if (required) {
    const { createClient } = require("@hey-api/openapi-ts");
    const config = Container.get(Intera__Config);
    const logger = Container.get(Logger);
    logger.info("Creating API client");
    const modulePath = join(config.moduleDirectory, "../", "@intera", "client");

    createClient({
      input: join(config.appDirectory, "public", "api.json"),
      output: modulePath,
      plugins: [...required],
      logs: {
        level: "silent",
      },
    });

    const template = require("./package.template.json");
    Bun.write(
      join(modulePath, "package.json"),
      JSON.stringify(template, null, 2)
    );
  }
}
