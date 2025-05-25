import { FastifyReply, FastifyRequest } from "fastify";
import Container, { Token } from "typedi";
import { InteraMiddleware, InteraRequest } from "../types/router.types";

export const buildMiddlewares = (middlewares?: Token<unknown>[]) => {
	return middlewares?.length
		? middlewares.map((middleware) => {
				return async (req: FastifyRequest, res: FastifyReply) => {
					const middlewareClass = Container.get<InteraMiddleware>(middleware);
					if (!middlewareClass || !middlewareClass.run) {
						throw new Error(
							`${middleware.name} must extend InteraMiddleware and offer a 'run' function`,
						);
					}
					await middlewareClass.run(req as InteraRequest, res);
					return;
				};
			})
		: [];
};
