import type { FastifyCorsOptions } from "@fastify/cors";

export type InteraConfig = {
  apiClientPath?: string;
  withScalar?: boolean;
  withOpenApi?: boolean;
  apiBaseUrl?: string;
  withClientGenerator?: string[];
  apiName?: string;
  cors?: FastifyCorsOptions;
  logging?: {
    request?: boolean;
  };
};
