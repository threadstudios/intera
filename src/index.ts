import "core-js";
import { Container } from "typedi";
import Fastify, { type FastifyInstance } from "fastify";
import { Intera__RouterCache } from "./caches/RouterCache";
import fastifyExpress from "@fastify/express";
import { getControllerRoute } from "./decorators/Controller";
import { validate } from "./route/validate";
import type { InteraConfig } from "./types/config.types";
import { extractAllParams } from "./decorators/Route/Params";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import type { InteraRequest } from "./types/router.types";
import { withOpenApiGenerator } from "./dx/openAPI";
import { Intera__Config } from "./config";
import { withScalar } from "./dx/scalar";
import { Logger } from "./logger";
import { withApiClient } from "./dx/apiClient";
import { HttpError } from "./errors";

export async function InteraServer({
  coreModule,
  config,
}: {
  coreModule: Function;
  config: InteraConfig;
}) {
  const configClass = new Intera__Config(config.apiClientPath);
  Container.set(Intera__Config, configClass);
  Container.get(coreModule);
  const loggerInstance = new Logger();
  Container.set(Logger, loggerInstance);

  const fastify: FastifyInstance = Fastify();

  await fastify.register(fastifyCookie);
  await fastify.register(fastifyExpress);
  fastify.register(fastifyStatic, {
    root: `${process.cwd()}/public`,
    prefix: "/public/",
  });

  const routes = Container.get(Intera__RouterCache).getAllRoutes();

  const finalCodegenRoutes = routes.map((routeRecord) => {
    const controllerRoute = getControllerRoute(routeRecord.target.constructor);
    const routePath = controllerRoute
      ? `${controllerRoute}${routeRecord.route}`
      : routeRecord.route;
    return {
      ...routeRecord,
      route: routePath,
    };
  });

  withOpenApiGenerator({
    required: config.withOpenApi ?? false,
    routes: finalCodegenRoutes,
  });

  for (const routeRecord of finalCodegenRoutes) {
    const { method, target, handler, route, middlewares, schemas } =
      routeRecord;
    const controllerInstance = Container.get(target.constructor);

    if (method === "*") {
      fastify.use(route, middlewares);
    } else {
      const isDeleteOrGet = ["delete", "get"].includes(method);
      loggerInstance.info(
        `Registering route ${method.toUpperCase()}\t${route}`
      );
      fastify[method](
        route,
        { preHandler: middlewares ?? [] },
        async (request, reply) => {
          try {
            if (schemas?.[0]) {
              validate(
                schemas[0],
                isDeleteOrGet ? request.query : request.body
              );
            }
            const args = Array.from(
              { length: handler.length },
              () => undefined
            );
            extractAllParams(
              target,
              handler.name,
              args,
              request as InteraRequest,
              reply
            );
            const result = await handler.apply(controllerInstance, args);
            if (schemas?.[1]) {
              validate(schemas[1], result);
            }
            reply.send(result);
          } catch (error: unknown) {
            if (error instanceof HttpError) {
              reply
                .code(error.statusCode)
                .send({ error: error.message, ...error.body });
              return;
            }
            reply.code(500).send({ error: (error as Error).message });
          }
        }
      );
    }
  }

  withScalar({
    required: config.withScalar ?? false,
    fastify,
  });

  withApiClient({
    required: config.withClientGenerator,
  });

  await fastify.ready();

  return fastify;
}

export { Service } from "typedi";
export { Module } from "./decorators/Module";
export { Controller } from "./decorators/Controller";
export type { InteraRequest, InteraReply } from "./types/router.types";
