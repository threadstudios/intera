import type { FastifyReply, FastifyRequest } from "fastify";
import Container, { Token } from "typedi";
import {
  InteraMiddlewareClass,
  type InteraMiddleware,
  type InteraRequest,
} from "../types/router.types";

export const buildMiddlewares = (middlewares?: InteraMiddleware[]) => {
  return middlewares?.length
    ? middlewares.map((middleware) => {
        return async (req: FastifyRequest, res: FastifyReply) => {
          const middlewareClass = Container.get<InteraMiddlewareClass>(
            middleware as Token<unknown>
          );
          if (!middlewareClass || !middlewareClass.run) {
            throw new Error(
              `${middleware.constructor.name} must extend InteraMiddleware and offer a 'run' function`
            );
          }
          await middlewareClass.run(req as InteraRequest, res);
          return;
        };
      })
    : [];
};
