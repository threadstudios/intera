import { Container } from "typedi";
import { Intera__RouterCache } from "../../caches/RouterCache";
import { RestMethods, type RouterMiddleware } from "../../types/router.types";
import "reflect-metadata";

export const ROUTE_METADATA_KEY = Symbol("ROUTE_METADATA");

function createMethodDecorator(method: RestMethods) {
  return (path: string, middlewares?: RouterMiddleware[]) =>
    (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
      const routeKey = `${target.constructor.name}.${propertyKey}`;

      const routeMetadata = {
        method,
        path,
      };

      Reflect.defineMetadata(
        ROUTE_METADATA_KEY,
        routeMetadata,
        target,
        propertyKey
      );

      const routerCache = Container.get(Intera__RouterCache);
      routerCache.setRoute(routeKey, {
        method,
        route: path,
        target,
        parent: target.constructor,
        handler: descriptor.value,
        middlewares: middlewares || [],
      });
    };
}

export const Get = createMethodDecorator(RestMethods.Get);
export const Post = createMethodDecorator(RestMethods.Post);
export const Put = createMethodDecorator(RestMethods.Put);
export const Delete = createMethodDecorator(RestMethods.Delete);
export const Patch = createMethodDecorator(RestMethods.Patch);
export const Options = createMethodDecorator(RestMethods.Options);
export const Head = createMethodDecorator(RestMethods.Head);
