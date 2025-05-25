import Container from "typedi";
import type { ZodAny } from "zod/v4";
import { Intera__RouterCache } from "../caches/RouterCache";

export function IO(schemas: [ZodAny, ZodAny]) {
	return (target: object, propertyKey: string | symbol) => {
		const routeKey = `${target.constructor.name}.${propertyKey.toString()}`;
		const routerCache = Container.get(Intera__RouterCache);
		routerCache.setSchemas(routeKey, schemas);
	};
}
