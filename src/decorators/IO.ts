import Container from "typedi";
import { Intera__RouterCache } from "../caches/RouterCache";
import type { Type } from "arktype";

export function IO(schemas: [Type<unknown>, Type<unknown>]) {
  return (target: object, propertyKey: string | symbol) => {
    const routeKey = `${target.constructor.name}.${propertyKey.toString()}`;
    const routerCache = Container.get(Intera__RouterCache);
    routerCache.setSchemas(routeKey, schemas);
  };
}
