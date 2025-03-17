import Container from "typedi";
import { join } from "node:path";
import { Intera__Config } from "../../config";
import { Logger } from "../../logger";

export function withApiClient({ required }: { required?: string | undefined }) {
  if (required) {
    const { createClient } = require("@hey-api/openapi-ts");
    const config = Container.get(Intera__Config);
    const logger = Container.get(Logger);
    logger.info("Creating API client");

    createClient({
      input: join(config.appDirectory, "public", "api.json"),
      output: join(config.moduleDirectory, "@intera", "client"),
      plugins: [required],
      logs: {
        level: "silent",
      },
    });
  }
}
