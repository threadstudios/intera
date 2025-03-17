import Container, { Service } from "typedi";
import type { RouterMiddleware } from "../types/router.types";
import { Intera__RouterCache } from "../caches/RouterCache";
import "reflect-metadata";

const CONTROLLER_KEY = Symbol("INTERA_CONTROLLER");

export function Controller(path?: string, middlewares?: RouterMiddleware[]) {
  return <TFunction extends Function>(ctor: TFunction) => {
    Service()(ctor);
    Reflect.defineMetadata(CONTROLLER_KEY, path, ctor);
    if (middlewares && path) {
      const routerCache = Container.get(Intera__RouterCache);
      routerCache.setRoute(`controller.${path}`, {
        method: "*",
        route: path,
        target: ctor.prototype,
        handler: null,
        middlewares: middlewares || [],
      });
    }
  };
}

export function getControllerRoute(target: object) {
  return Reflect.getMetadata(CONTROLLER_KEY, target);
}
